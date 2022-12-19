const mb = require('mountebank');
const settings = require('./settings');
const mbHelper = require('./mountebank-helper');
const imposterJSON = require('./imposterinitdata.json');



const mbServerInstance = mb.create({
    port: settings.port,
    pidfile: '../mb.pid',
    logfile: '../mb.log',
    protofile: '../protofile.json',
    ipWhitelist: ['*']
});


mbServerInstance.then(function () {
    return mbHelper.postImposter(imposterJSON, "PUT");

    // idpService.addService();
    // workday.addService();
    // servicenow.addService();
    // infinityconnect.addService();
    // datalake.addService();
    // dihService.addService();




});


