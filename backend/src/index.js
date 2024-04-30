const mb = require("mountebank");
const settings = require("./settings");
const mbHelper = require("./mountebank-helper");
const mongodbServer = require("./mongodb-server");

const mbServerInstance = mb.create({
  port: settings.port,
  origin: "http://localhost:4200",
  pidfile: "../mb.pid",
  logfile: "../mb.log",
  protofile: "../protofile.json",
  ipWhitelist: ["*"],
});

mbServerInstance.then(async function () {
  //read from mongoDB
  const mongodbServerObject = await mongodbServer.startMongodbServer();
  const impostersList = await mongodbServerObject.imposters.find().toArray();
  return mbHelper.postImposter(
    {
      imposters: impostersList,
    },
    "PUT"
  );
});
