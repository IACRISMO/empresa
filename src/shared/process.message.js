const whatsappService = require('../services/whatsapp.service');
const chatGptService = require('../services/ia.service');
const dbService = require('../services/db.service');

async function processByCliente(text, number , ia = 'Gemini') {

    let response = null;
    let cliente = await dbService.getClientByPhone(number);

    // consultamos a gemini
    if(ia == 'Gemini'){
        // response =  await chatGptService.getMessageGemini(text)
        response = await chatGptService.getMessageGeminiInstance_(text);

        response = response && response.includes('N0L0S3') ? "Este problema se le derivara a un desarrollador." : response;
    };

    // consultamos a gpt
    if(ia == 'GPT'){
        response = chatGptService.getMessageChatGPT(text)
    };

    response = response ? response : "No se pudo obtener respuesta , vuelva a intentarlo";
   
    if(cliente){
        whatsappService.sendMessageListWhatsap(response, number);
    }else{
        // Iniciamos creando nuestro cliente
        await dbService.createClient({cliente_telefono: number});
        whatsappService.sendMessageWhatsap(response, number);
    };

};

async function process(text, number , ia = 'Gemini') {
    let response = null;

    if(ia == 'Gemini'){
        // response =  await chatGptService.getMessageGemini(text)
        response = await chatGptService.getMessageGeminiInstance_(text);

        response = response && response.includes('N0L0S3') ? "Este problema se le derivara a un desarrollador." : response;
    };

    if(ia == 'GPT'){
        response = chatGptService.getMessageChatGPT(text)
    };

    response = response ? response : "No se pudo obtener respuesta , vuelva a intentarlo";

    whatsappService.sendMessageWhatsap(response, number);
    // whatsappService.sendMessageListWhatsap(response, number);
};

module.exports = {
    process,
    processByCliente
};