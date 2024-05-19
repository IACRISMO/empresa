const fs = require('fs');   
const myConsole = new console.Console(fs.createWriteStream('./logswpp.txt'));
const whatsappService = require('../services/whatsapp.service');
const processMessage = require('../shared/process.message');

const verifyToken = (req , res) => {

    try {
        var accessToken = 'RTX2024';
        var token = req.query['hub.verify_token'];
        var challenge = req.query['hub.challenge'];

        if (challenge && token && token === accessToken) {
            res.status(200).send(challenge);
        }else{
            res.status(400).send();
        };
        
    } catch (e) {
        res.status(400).send();
    };

};

const ReceiveMessage = (req , res) => {
    // console.log('hola');
    try {
        var entry = req.body['entry'][0];
        var changes = entry['changes'][0];
        var value = changes['value'];
        var messageObject = value['messages'];

        if(typeof messageObject !== 'undefined'){
            var messages = messageObject[0];
          
            var text = GetTextUser(messages);
            var number = messages['from'];
            // console.log(messages);
            // myConsole.log(messageObject);
            // console.log(text);

            // processMessage.process(text, number , 'Gemini');
            // whatsappService.sendMessageWhatsap("El usuario dijo : "+text, number);
            whatsappService.sendMessageListWhatsap("El usuario dijo : "+text, number);
        };
       

        res.send("EVENT_RECEIVED");
    } catch (e) {
        console.log('error');
        res.send("EVENT_RECEIVED");
    };

    function GetTextUser(messages) {
        var text = "";
        var typeMessage = messages['type'];
        if(typeMessage == 'text'){
            text = messages['text']['body'];    
        }else if(typeMessage == 'interactive'){

            var interactiveObj = messages['interactive'];
            var typeInteractive = interactiveObj['type'];

            if(typeInteractive == 'button_reply'){
                text = interactiveObj['button_reply']['title'];
            } else if(typeInteractive == "list_reply"){
                text = interactiveObj['list_reply']['title'];
            } else{   
                myConsole.log('no se encontro el tipo de mensaje')
            };

        };
        
        return text;
    };

    // res.send('hola recive')
};

module.exports = {
    verifyToken,
    ReceiveMessage
};