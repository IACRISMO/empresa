const htpps = require('https');

function sendMessageWhatsap(txtResponse , number){

    const data = JSON.stringify({
        messaging_product: 'whatsapp',
        to: number,
        text: {
            body: txtResponse
        },
        type: 'text'
    });

    const options = {
        hostname: 'graph.facebook.com',
        path: '/v18.0/318584924670058/messages',
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer EAAFZBXIgGNN0BO3dp2Efe1O0ZCHjEe7uOsHnSrZATAzLnOPCwszFDHc7SUWvf6U5atZCZBUWF5v8YiIvjx2XFzCCZBTvhJzj5ZCvIHTNrcWybmF2mwYnowOG9U3SrXxnvaZCD4SDO9OgrbS9yOiHF9GzqPDJhGU4HCApsLUxZCZAsRgMwhmBtAUvDIS61IpP2csKbpko0JMLhE2MQedq9MYgMPMEs9Y8ACqbfkvZBZBcOQ8ZD'
        }
    };

    const req = htpps.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on('data', (d) => {
            process.stdout.write(d);
        }); 
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.write(data);
    req.end();

};

function sendMessageListWhatsap(txtResponse , number){

    const data = JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: number,
        type: "interactive",
        interactive: {
            type: "list",
            header: {
                type: "text",
                text: "EL PEPE HEADERS"
            },
            body: {
                text: "EL PEPE BODY"
            },
            footer: {
                text: "EL PEPE FOOTER"
            },
            action: {
                button: "<BUTTON_TEXT>",
                sections: [
                    {
                        "title": "<LIST_SECTION_1_TITLE>",
                        "rows": [
                            {
                                "id": "<LIST_SECTION_1_ROW_1_ID>",
                                "title": "<SECTION_1_ROW_1_TITLE>",
                                "description": "<SECTION_1_ROW_1_DESC>"
                            },
                            {
                                "id": "<LIST_SECTION_1_ROW_2_ID>",
                                "title": "<SECTION_1_ROW_2_TITLE>",
                                "description": "<SECTION_1_ROW_2_DESC>"
                            }
                        ]
                    },
                    {
                        "title": "<LIST_SECTION_2_TITLE>",
                        "rows": [
                            {
                                "id": "<LIST_SECTION_2_ROW_1_ID>",
                                "title": "<SECTION_2_ROW_1_TITLE>",
                                "description": "<SECTION_2_ROW_1_DESC>"
                            },
                            {
                                "id": "<LIST_SECTION_2_ROW_2_ID>",
                                "title": "<SECTION_2_ROW_2_TITLE>",
                                "description": "<SECTION_2_ROW_2_DESC>"
                            }
                        ]
                    }
                ]
            }
        }
    });

    const options = {
        hostname: 'graph.facebook.com',
        path: '/v19.0/318584924670058/messages',
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer EAAFZBXIgGNN0BO3dp2Efe1O0ZCHjEe7uOsHnSrZATAzLnOPCwszFDHc7SUWvf6U5atZCZBUWF5v8YiIvjx2XFzCCZBTvhJzj5ZCvIHTNrcWybmF2mwYnowOG9U3SrXxnvaZCD4SDO9OgrbS9yOiHF9GzqPDJhGU4HCApsLUxZCZAsRgMwhmBtAUvDIS61IpP2csKbpko0JMLhE2MQedq9MYgMPMEs9Y8ACqbfkvZBZBcOQ8ZD'
        }
    };

    const req = htpps.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on('data', (d) => {
            process.stdout.write(d);
        }); 
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.write(data);
    req.end();
};

module.exports = {  
    sendMessageWhatsap,
    sendMessageListWhatsap
};

