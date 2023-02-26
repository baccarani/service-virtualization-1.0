const mbHelper = require('./mountebank-helper');
const settings = require('./settings');
const imposterJSON = require('./imposterinitdata.json');


function addService() {
    const response = { message: "hello world" }
    const imposters = [];

    const stubs = [
        {
            predicates: [ {
                equals: {
                    method: "GET",
                    "path": "/"
                }
            }],
            responses: [
                {
                    is: {
                        statusCode: 200,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(response)
                    }
                }
            ]
        }
    ];

    const imposter = {
        port: settings.idp_service_port,
        protocol: 'http',
        stubs: stubs,
        name: 'IDP'
    };

    const imposter2 = {
        port: 6000,
        protocol: 'http',
        stubs: stubs,
        name: 'IDP2'
    };

    imposters.push(imposter, imposter2);
    return mbHelper.postImposter(imposterJSON, "PUT");
    
}

module.exports = { addService };