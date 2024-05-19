const whatsappService = require('../services/whatsapp.service');
const chatGptService = require('../services/ia.service');

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
    process
};