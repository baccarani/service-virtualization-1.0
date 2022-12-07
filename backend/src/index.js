const mb = require('mountebank');
const settings = require('./settings');
const helloService = require('./hello-service');
const customerService = require('./customer-service');


const mbServerInstance = mb.create({
        port: settings.port,
        pidfile: '../mb.pid',
        logfile: '../mb.log',
        protofile: '../protofile.json',
        ipWhitelist: ['*']
    });


    mbServerInstance.then(function() {
        helloService.addService();
        customerService.addService();
    });


    