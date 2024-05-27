const htpps = require('https');
const dbService = require('../services/db.service');

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

async function sendMessageListWhatsap(txtResponse , number , type = 'servicios'){

    let vector = [];
    if(type == 'servicios'){
        vector = await dbService.getAllServices();
    };

    const data = JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: number,
        type: "interactive",
        interactive: {
            type: "list",
            header: {
                type: "text",
                text: "Servicios de Polivet"
            },
            body: {
                text: "Por favor selecciona el servicio que deseas."
            },
            footer: {
                text: "Gracias por elegir Polivet."
            },
            action: {
                button: "Servicios",
                sections: [
                    {
                        "title": type.toUpperCase(),
                        "rows": vector
                    },
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

