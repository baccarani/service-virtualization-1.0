const express = require("express");
const cors = require("cors");
const compression = require("compression"); //middleware
const { MongoClient } = require("mongodb");
const settings = require("./settings");
const client = new MongoClient(settings.mongodbUri);
const mbHelper = require("./mountebank-helper");

/*
NOTE:
1. on add imposter, call / api  
2. on edit imposter, call /updateImposter api
2. on delete, call /deletedImposter api
3. on restore deleted, call /restoreDeletedImposter api
*/

function errorHandler(err, req, res, next) {
  res.status(500).send(err.message);
}

async function startMongodbServer() {
  await client.connect();
  const database = client.db("Mountebank");
  const imposters = database.collection("Imposters");
  const impostersBackup = database.collection("ImpostersBackup");
  const impostersDeleted = database.collection("ImpostersDeleted");
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: "http://localhost:4200",
    })
  );
  app.use(compression()); //compress responses for client to get it faster

  //return all imposters json from imposter collection
  app.get("/imposters", async (req, res, next) => {
    try {
      const impostersList = await imposters.find().toArray();
      res.send(impostersList);
    } catch (err) {
      next(err);
    }
  });

  //return a specific imposter json from imposter collection
  app.post("/imposter", async (req, res, next) => {
    try {
      const query = { port: req.body.port };
      const imposter = await imposters.findOne(query);
      res.send(imposter);
    } catch (err) {
      next(err);
    }
    // } finally {
    //   // Ensures that the client will close when you finish/error
    //   await client.close();
    // }
  });

  //restore a specific imposter from backup collection to imposters collection
  app.post("/restoreImposter", async (req, res, next) => {
    const session = client.startSession();
    try {
      const query = { port: req.body.port };
      const imposterFromBackup = await impostersBackup.findOne(query);
      await session.withTransaction(async () => {
        // insert into imposters collection
        const result = await imposters.insertOne(imposterFromBackup);
        res.send(result);
      });
      await session.endSession();
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  });

  //restore all imposters from backup collection to imposters collection
  app.get("/restoreImposters", async (req, res, next) => {
    const session = client.startSession();
    try {
      // drop all records
      await session.withTransaction(async () => {
        const impostersDroppedStatus = await imposters.deleteMany();
        if (impostersDroppedStatus.acknowledged) {
          // insert into imposters collection
          const impostersFromBackup = await impostersBackup.find().toArray();
          const result = await imposters.insertMany(impostersFromBackup);
          res.send(result);
        } else {
          throw new Error("failed to restore imposters");
        }
      });
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  });

  //add a imposter to imposters collection
  app.post("/addImposter", async (req, res, next) => {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        const result = await imposters.insertOne(req.body);
        if (result.acknowledged && result.insertedId) {
          res.send(result);
        } else {
          throw new Error("failed to add imposter");
        }
      });
      session.endSession();
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  });

  //update a specific imposter in imposters collection
  app.post("/updateImposter", async (req, res, next) => {
    const session = client.startSession();
    try {
      const query = { port: req.body.port };
      await session.withTransaction(async () => {
        const updateStatus = await imposters.updateOne(query, { $set: req.body });
        if (updateStatus.acknowledged && updateStatus.modifiedCount === 1) {
          res.send(updateStatus);
        } else {
          throw new Error("failed to update imposter");
        }
      });
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  });

  //update all imposters in imposters collection
  app.post("/updateImposters", async (req, res, next) => {
    const session = client.startSession();
    try {
      //bulkwrite (update) all imposters
      const impostersToUpdate = req.body.map((imposter) => {
        return {
          updateOne: {
            filter: { port: imposter.port },
            update: { $set: imposter },
          },
        };
      });
      await session.withTransaction(async () => {
        const result = await imposters.bulkWrite(impostersToUpdate, {
          ordered: false,
        });
        res.send(result);
      });
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  });

  //drop all imposters in collection and save all imposters from request body to imposters collection
  app.post("/saveImposters", async (req, res, next) => {
    const session = client.startSession();
    try {
      // drop all records
      await session.withTransaction(async () => {
        const impostersDroppedStatus = await imposters.deleteMany();
        if (impostersDroppedStatus.acknowledged) {
          // insert into imposters collection
          const result = await imposters.insertMany(req.body);
          res.send(result);
        } else {
          throw new Error("failed to save imposters");
        }
      });
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  });

  //drop all imposters in backup collection and save all imposters from imposters collection to backup collection
  app.get("/updateBackup", async (req, res, next) => {
    const session = client.startSession();
    try {
      // drop all records
      await session.withTransaction(async () => {
        const impostersBackupDroppedStatus = await impostersBackup.deleteMany();
        if (impostersBackupDroppedStatus.acknowledged) {
          // insert into impostersBackup collection
          const impostersList = await imposters.find().toArray();
          const result = await impostersBackup.insertMany(impostersList);
          res.send(result);
        } else {
          throw new Error("failed to update imposters backup");
        }
      });
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  });

  //get all deleted imposters in impostersDeleted collection
  app.get("/getAllDeletedImposters", async (req, res, next) => {
    try {
      const result = await impostersDeleted.find().toArray();
      res.send(result);
    } catch (err) {
      next(err);
    }
  });

  //insert deleted imposter into impostersDeleted collection
  app.post("/deletedImposter", async (req, res, next) => {
    const session = client.startSession();
    try {
      const query = { port: req.body.port };
      const imposterDeleted = await imposters.findOne(query);
      // delete imposter from imposters collection
      await session.withTransaction(async () => {
        const result2 = await imposters.deleteOne(query);
        if (result2.acknowledged && result2.deletedCount === 1) {
          // insert into impostersDeleted collection
          const result = await impostersDeleted.insertOne(imposterDeleted);
          res.send(imposterDeleted);
        } else {
          throw new Error("failed to delete imposter");
        }
      });
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  });

  //restore deleted imposter from impostersDeleted collection to imposters collection
  app.post("/restoreDeletedImposter", async (req, res, next) => {
    const session = client.startSession();
    try {
      const query = { port: req.body.port };
      const imposterFromDeleted = await impostersDeleted.findOne(query);
      // insert into imposters collection
      await session.withTransaction(async () => {
        const restoreStatus = await imposters.insertOne(imposterFromDeleted);
        if (restoreStatus.acknowledged && restoreStatus.insertedId) {
          // delete imposted from impostersDeleted collection
          const deleteStatus = await impostersDeleted.deleteOne(query);
          // make post call to insert imposter into mountebank
          const response = await mbHelper.postImposter(imposterFromDeleted);
          res.send(response);
        } else {
          throw new Error("failed to restore deleted imposter");
        }
      });
    } catch (err) {
      next(err);
    } finally {
      await session.endSession();
    }
  });

  app.use(errorHandler);

  app.listen(settings.mongodbPort, () => {
    console.log(`Mongo DB server listening on port ${settings.mongodbPort}`);
  });

  return {
    serverApp: app,
    imposters: imposters,
    impostersBackup: impostersBackup,
    impostersDeleted: impostersDeleted,
  };
}

module.exports = { startMongodbServer };
