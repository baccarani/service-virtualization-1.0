const mb = require('mountebank');
const settings = require('./settings');
const idpService = require('./idp-service');
const dihService = require('./dih-service');
const workday = require('./workday-service');
const servicenow = require('./servicenow-service');
const infinityconnect = require('./infinityconnect-service');
const datalake = require('./datalake-service');
const cors = require('cors');


const mbServerInstance = mb.create({
        port: settings.port,
        pidfile: '../mb.pid',
        logfile: '../mb.log',
        protofile: '../protofile.json',
        ipWhitelist: ['*']
    });


    mbServerInstance.then(function() {
        idpService.addService();
        dihService.addService();
        workday.addService();
        servicenow.addService();
        infinityconnect.addService();
        datalake.addService();


    });


    