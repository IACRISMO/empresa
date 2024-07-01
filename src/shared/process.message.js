const whatsappService = require('../services/whatsapp.service');
const chatGptService = require('../services/ia.service');
const dbService = require('../services/db.service');
const utilityService = require('../services/utility.service');

async function processByCliente(text, number , ia = 'Gemini') {

    let response = null;
    let cliente = null;
    let procesoRegistro = false;
    let procesoRegistro_ = false;
    let procesoConsulta = false;

    try {
        cliente = await dbService.getClientByPhone(number);
    } catch (error) {
        console.error(error);
    };
    
    // Seguimos el flujo de conversacion pedimos el nombre y luego dni
    if(cliente){

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
        if(!cliente.cliente_dni && cliente.cliente_nombre){
            procesoRegistro = true;
            if(utilityService.esDniValido(text)){
                await dbService.updateClient(cliente.cliente_id, { ...cliente , cliente_dni: text});
                response = "¡Muchas gracias "+cliente.cliente_nombre+" , ahora puedo ayudarte con tu consulta , que tipo de servicio necesitas?.";
                procesoRegistro_ = true;
            }else{
                response = "DNI invalido, por favor ingrese un DNI valido.";
            };
        };

        // guardamos la conversacion
        await dbService.createConversation({ clienteId: cliente.cliente_id , conversacion_mensaje: text});

        // enviamos mensaje
        if(procesoRegistro){
            whatsappService.sendMessageWhatsap(response, number);

            // Si validamos todos los datos le enviamos el listado de categorias
            if(procesoRegistro_)
            whatsappService.sendMessageListWhatsap(response, number);
        } 
        else whatsappService.sendMessageListWhatsap(response, number);

    }else{

        // Pedimos a ia que nos de un mensaje de bienvenida
        response = await proccessWelcome(text , ia);

        // Iniciamos creando nuestro cliente
        cliente = await dbService.createClient({cliente_telefono: number});
        // console.log('cliente creado:', cliente);
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

async function proccessWelcome(text, ia) {

    let response = null;

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

    return (response ? response : "No se pudo obtener respuesta , vuelva a intentarlo");

};

module.exports = {
    process,
    processByCliente
};