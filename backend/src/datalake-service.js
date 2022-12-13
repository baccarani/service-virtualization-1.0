const mbHelper = require('./mountebank-helper');
const settings = require('./settings');

function addService() {
    const response = { message: "hello world" }

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
        port: settings.datalake_service_port,
        protocol: 'http',
        stubs: stubs,
        name: 'Datalake'
    };

    return mbHelper.postImposter(imposter);
    
}

module.exports = { addService };