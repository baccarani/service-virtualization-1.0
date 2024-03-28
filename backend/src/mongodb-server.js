const express = require('express');
const { MongoClient } = require('mongodb');
const settings = require('./settings');
const client = new MongoClient(settings.mongodbUri);

async function startMongodbServer() {
  await client.connect();
  const database = client.db('Mountebank');
  const imposters = database.collection('Imposters');
  const impostersBackup = database.collection('ImpostersBackup');
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded());

  app.get('/imposters', async (req, res) => {
    try {
      const impostersList = await imposters.find().toArray();
      //console.log(impostersList);
      res.send(impostersList);
    } catch(err) {
      res.send({ error: err.toString()});
    }
  });

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

  app.listen(settings.mongodbPort, () => {
    console.log(`Mongo DB server listening on port ${settings.mongodbPort}`);
  });

  return { 
    serverApp: app,
    imposters: imposters,
    impostersBackup: impostersBackup
  };
}

module.exports = { startMongodbServer };