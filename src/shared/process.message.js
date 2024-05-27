const whatsappService = require('../services/whatsapp.service');
const chatGptService = require('../services/ia.service');
const dbService = require('../services/db.service');

async function processByCliente(text, number , ia = 'Gemini') {

    let response = null;
    let cliente = null;

    try {
        console.log(await dbService.getAllClients());
        cliente = await dbService.getClientByPhone(number);
    } catch (error) {
        console.error(error);
    };
 

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
    // console.log('cliente',cliente);
    if(cliente){
        await dbService.createConversation({ clienteId: cliente.cliente_id , conversacion_mensaje: text,});
        whatsappService.sendMessageListWhatsap(response, number);
    }else{
        // Iniciamos creando nuestro cliente
        cliente = await dbService.createClient({cliente_telefono: number});
        await dbService.createConversation({ clienteId: cliente.cliente_id , conversacion_mensaje: text,});
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