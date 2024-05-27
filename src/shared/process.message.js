const whatsappService = require('../services/whatsapp.service');
const chatGptService = require('../services/ia.service');
const dbService = require('../services/db.service');
const utilityService = require('../services/utility.service');

async function processByCliente(text, number , ia = 'Gemini') {

    let response = null;
    let cliente = null;
    let procesoRegistro = false;

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
    if(cliente){
        // Seguimos el flujo de conversacion pedimos el nombre y luego dni

        // validamos si el cliente ya tiene nombre
        if(!cliente.cliente_nombre){
            procesoRegistro = true;
            if(utilityService.esNombreValido(text)){
                await dbService.updateClient(cliente.cliente_id, { ...cliente , cliente_nombre: text});
                response = "Hola "+text+" , ahora necesito tu DNI.";
            }else{
                response = "Nombre invalido, por favor ingrese un nombre valido.";
            };
        };

        // validamos si el cliente ya tiene dni
        if(!cliente.cliente_dni){
            procesoRegistro = true;
            if(utilityService.esDniValido(text)){
                await dbService.updateClient(cliente.cliente_id, { ...cliente , cliente_nombre: text});
                response = "¡Muchas gracias "+cliente.cliente_nombre+" , ahora puedo ayudarte con tu consulta!.";
            }else{
                response = "DNI invalido, por favor ingrese un DNI valido.";
            };
        };

        await dbService.createConversation({ clienteId: cliente.cliente_id , conversacion_mensaje: text});
        if(procesoRegistro) whatsappService.sendMessageWhatsap(response, number);
        else whatsappService.sendMessageListWhatsap(response, number);

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