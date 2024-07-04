const fs = require('fs');   
const myConsole = new console.Console(fs.createWriteStream('./logswpp.txt'));
const whatsappService = require('../services/whatsapp.service');
const processMessageService = require('../shared/process.message');

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

const  ReceiveMessage = (req , res) => {
    try {
        var entry = req.body['entry'][0];
        var changes = entry['changes'][0];
        var value = changes['value'];
        var messageObject = value['messages'];

        if(typeof messageObject !== 'undefined'){
            var messages = messageObject[0];
            console.log(messages);
            var parseMessage = GetTextUser(messages);
            var number = messages['from'];

            processMessageService.processByCliente(parseMessage, number , 'Gemini');
        };
       

        res.send("EVENT_RECEIVED");
    } catch (e) {
        console.log('error');
        res.send("EVENT_RECEIVED");
    };

    function GetTextUser(messages) {
        let parseMessage = {
            text: '',
            opcion : { id: '', title: ''},
            typeMessage : '',
        };
        parseMessage.typeMessage = messages['type'];

        if(parseMessage.typeMessage == 'text'){
            parseMessage.text = messages['text']['body'];    
        }else if(parseMessage.typeMessage == 'interactive'){

            var interactiveObj = messages['interactive'];
            var typeInteractive = interactiveObj['type'];

            if(typeInteractive == 'button_reply'){
                parseMessage.text = interactiveObj['button_reply']['title'];
                parseMessage.opcion = interactiveObj['button_reply'];
            } else if(typeInteractive == "list_reply"){
                parseMessage.text = interactiveObj['list_reply']['title'];
                parseMessage.opcion = interactiveObj['list_reply'];
            } else{   
                myConsole.log('no se encontro el tipo de mensaje')
            };

        };
        
        return parseMessage;
    };

    // res.send('hola recive')
};

module.exports = {
    verifyToken,
    ReceiveMessage
};