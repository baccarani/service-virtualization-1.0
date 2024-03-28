const express = require('express');
const { MongoClient } = require('mongodb');
const settings = require('./settings');
const client = new MongoClient(settings.mongodbUri);
const mbHelper = require('./mountebank-helper');

async function startMongodbServer() {
  await client.connect();
  const database = client.db('Mountebank');
  const imposters = database.collection('Imposters');
  const impostersBackup = database.collection('ImpostersBackup');
  const impostersDeleted = database.collection('ImpostersDeleted');
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded());

  //return all imposters json from imposter collection
  app.get('/imposters', async (req, res) => {
    try {
      const impostersList = await imposters.find().toArray();
      //console.log(impostersList);
      res.send(impostersList);
    } catch(err) {
      res.send({ error: err.toString()});
    }
  });

  //return a specific imposter json from imposter collection
  app.post('/imposter', async (req, res) => {
    //console.log(req.body);
    try {
      const query = { port: req.body.port };
      const imposter = await imposters.findOne(query);
      //console.log(imposter);
      res.send(imposter);
    } catch(err) {
      res.send({ error: err.toString()});
    }
    // } finally {
    //   // Ensures that the client will close when you finish/error
    //   await client.close();
    // }
  });

  //restore a specific imposter from backup collection to imposters collection
  app.post('/restoreImposter', async (req, res) => {
    //console.log(req.body);
    try {
      const query = { port: req.body.port };
      const imposterFromBackup = await impostersBackup.findOne(query);
      //console.log(imposterFromBackup);
      // insert into imposters collection
      const result = await imposters.insertOne(imposterFromBackup);
      //console.log(result);
      res.send(result);
    } catch(err) {
      res.send({ error: err.toString()});
    }
  });

  //restore all imposters from backup collection to imposters collection
  app.get('/restoreImposters', async (req, res) => {
    try {
      // drop all records
      const impostersDroppedStatus = await imposters.deleteMany();
      //console.log(impostersDroppedStatus);
      if (impostersDroppedStatus.acknowledged) {
        // insert into imposters collection
        const impostersFromBackup = await impostersBackup.find().toArray();
        const result = await imposters.insertMany(impostersFromBackup);
        //console.log(result);
        res.send(result);
      } else {
        res.send({ error: "failed to restore imposters"});
      }
    } catch(err) {
      res.send({ error: err.toString()});
    }
  });

  //update a specific imposter in imposters collection
  app.post('/updateImposter', async (req, res) => {
    //console.log(req.body);
    try {
      const query = { port: req.body.port };
      const result = await imposters.updateOne(query, { $set: req.body });
      //console.log(result);
      res.send(result);
    } catch(err) {
      res.send({ error: err.toString()});
    }
  });

  //drop all imposters in collection and save all imposters from request body to imposters collection
  app.post('/saveImposters', async (req, res) => {
    //console.log(req.body);
    try {
      // drop all records
      const impostersDroppedStatus = await imposters.deleteMany();
      //console.log(impostersDroppedStatus);
      if (impostersDroppedStatus.acknowledged) {
        // insert into imposters collection
        const result = await imposters.insertMany(req.body);
        //console.log(result);
        res.send(result);
      } else {
        res.send({ error: "failed to save imposters"});
      }
    } catch(err) {
      res.send({ error: err.toString()});
    }
  });

  //drop all imposters in backup collection and save all imposters from imposters collection to backup collection
  app.get('/updateBackup', async (req, res) => {
    try {
      // drop all records
      const impostersBackupDroppedStatus = await impostersBackup.deleteMany();
      //console.log(impostersBackupDroppedStatus);
      if (impostersBackupDroppedStatus.acknowledged) {
        // insert into impostersBackup collection
        const impostersList = await imposters.find().toArray();
        const result = await impostersBackup.insertMany(impostersList);
        //console.log(result);
        res.send(result);
      } else {
        res.send({ error: "failed to update imposters backup"});
      }
    } catch(err) {
      res.send({ error: err.toString()});
    }
  });

  //insert deleted imposter into impostersDeleted collection
  app.post('/deletedImposter', async (req, res) => {
    //console.log(req.body);
    try {
      // insert into impostersDeleted collection
      const result = await impostersDeleted.insertOne(req.body);
      //console.log(result);
      res.send(result);
    } catch(err) {
      res.send({ error: err.toString()});
    }
  });

  //restore deleted imposter from impostersDeleted collection to imposters collection
  app.post('/restoreDeletedImposter', async (req, res) => {
    //console.log(req.body);
    try {
      const query = { port: req.body.port };
      const imposterFromDeleted = await impostersDeleted.findOne(query);
      console.log(imposterFromDeleted);
      // insert into imposters collection
      const result = await imposters.insertOne(imposterFromDeleted);
      //console.log(result);

      // make post call to insert imposter into mountebank
      const response = await mbHelper.postImposter(imposterFromDeleted)
      //console.log(response);

      // return imposterslist instead of result for UI to reflect changes
      const impostersList = await imposters.find().toArray();
      res.send(impostersList);
    } catch(err) {
      res.send({ error: err.toString()});
    }
  });
  
  //NOTE:
  // 1. everytime adding or modifying imposter, has to call mongoDB api
  // 2. on delete, call /deletedImposter api
  // 3. on restore deleted, call /restoreDeletedImposter api

  app.listen(settings.mongodbPort, () => {
    console.log(`Mongo DB server listening on port ${settings.mongodbPort}`);
  });

  return { 
    serverApp: app,
    imposters: imposters,
    impostersBackup: impostersBackup,
    impostersDeleted: impostersDeleted
  };
}

module.exports = { startMongodbServer };