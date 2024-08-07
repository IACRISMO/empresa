const whatsappService = require('../services/whatsapp.service');
const chatGptService = require('../services/ia.service');
const dbService = require('../services/db.service');
const utilityService = require('../services/utility.service');
const path = require('path');
const fs = require('fs');

async function processByCliente(parseMessage, number , ia = 'Gemini') {

    let response = null;
    let cliente = null;
    let procesoRegistro = false;
    let procesoRegistro_ = false;

    // Obtenemos props del mensaje
    let text = parseMessage.text;
    let typeMessage = parseMessage.typeMessage;
    let opcion = parseMessage.opcion;

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
                await dbService.updateClient(cliente.cliente_id, { ...cliente , cliente_dni: text*1});
                response = "¡Muchas gracias "+cliente.cliente_nombre+" , ahora puedo ayudarte con tu consulta , que tipo de servicio necesitas?.";
                procesoRegistro_ = true;
            }else{
                response = "DNI invalido, por favor ingrese un DNI valido.";
            };
        };

        // enviamos mensaje
        if(procesoRegistro){

            whatsappService.sendMessageWhatsap(response, number);

            // Si validamos todos los datos le enviamos el listado de categorias
            if(procesoRegistro_){
                whatsappService.sendMessageListWhatsap(response, number);
                // guardamos tipo de la conversacion
                await dbService.createConversation({ 
                clienteId: cliente.cliente_id , 
                conversacion_mensaje: text,
                conversacion_tipo: utilityService.INSERT_CATEGORIA,
                });
            }else{
                // guardamos la conversacion
                await dbService.createConversation({ clienteId: cliente.cliente_id , conversacion_mensaje: text});
            };
           
        }else {

            // validamos tipo de conversacion por la ultima conversacion
            let lastConvesation = await dbService.getLastConversationByClientId(cliente.cliente_id);
            let respuesta = null;
            let enviarCategoria = false;
            let type = 'Categorias';

            console.log('lastConvesation:', lastConvesation);

            // Para empezar el flujo de conversacion nuevamente
            if(lastConvesation.conversacion_tipo == 'INIT_STATE'){
                response = "¿Que tipo de servicio necesitas?";
                enviarCategoria = true;

                await dbService.createConversation({ 
                    clienteId: cliente.cliente_id , 
                    conversacion_mensaje: text,
                    conversacion_tipo: utilityService.INSERT_CATEGORIA,
                });
            };

            if(lastConvesation.conversacion_tipo == 'INSERT_CATEGORIA'){
                // Validamos si el cliente selecciono una categoria
                if(!lastConvesation.categoria_id){
                    respuesta = await utilityService.procesarMensajeCliente(parseMessage, lastConvesation.conversacion_tipo);
                   
                    if(!respuesta.error){
                        // console.log('respuesta:', respuesta);
                        // console.log('opcion:', opcion);
                        console.log('[INSERT_CATEGORIA] -  no tenemos error, guardamos la conversacion', respuesta.servicioOrProducto);
                        // guardamos la conversacion
                        await dbService.createConversation({ 
                            clienteId: cliente.cliente_id , 
                            conversacion_mensaje: text,
                            categoria_id: (opcion.id*1),
                            conversacion_tipo: respuesta.servicioOrProducto,
                        });

                        if(respuesta.servicioOrProducto == utilityService.INSERT_PRODUCTO){
                            type = 'Productos';
                        }else{
                            type = 'Servicios';
                        };
                    }else{
                        response = respuesta.message;
                    };
                    
                };
            };

            // validamos si el cliente selecciono un servicio
            if(lastConvesation.conversacion_tipo == 'INSERT_SERVICIO'){
                // Validamos si el cliente selecciono un servicio
                if(!lastConvesation.servicio_id){
                    console.log('[INSERT_SERVICIO] -  no tenemos error, guardamos la conversacion');
                    respuesta = await utilityService.procesarMensajeCliente(parseMessage, lastConvesation.conversacion_tipo);
                    if(!respuesta.error){
                        // guardamos la conversacion
                        await dbService.createConversation({ 
                            clienteId: cliente.cliente_id , 
                            conversacion_mensaje: text,
                            servicio_id: (opcion.id*1),
                            conversacion_tipo: utilityService.INSERT_PAGO,
                        });
                        console.log('opcion:', opcion);
                        const servicio = await dbService.getServiceById(opcion.id*1);
                        response = `Entonces desea ${servicio.servicio_nombre} , el precio para este servicio es de S/ 25, puede cancelar con yape, puede enviarnos el comprobante de pago por este medio.`;
                    }else{
                        response = respuesta.message;
                    };

                        
                };
            };

            // validamos si el cliente selecciono un producto
            if(lastConvesation.conversacion_tipo == 'INSERT_PRODUCTO'){
                // Validamos si el cliente selecciono un producto
                if(!lastConvesation.producto_id){
                    console.log('[INSERT_PRODUCTO] -  no tenemos error, guardamos la conversacion');
                    respuesta = await utilityService.procesarMensajeCliente(parseMessage, lastConvesation.conversacion_tipo);
                    if(!respuesta.error){
                        // guardamos la conversacion
                        await dbService.createConversation({ 
                            clienteId: cliente.cliente_id , 
                            conversacion_mensaje: text,
                            producto_id: (opcion.id*1),
                            conversacion_tipo: utilityService.INSERT_CANTIDAD,
                        });

                        console.log('opcion:', opcion);
                        const producto = await dbService.getProductById(opcion.id*1);
                        response = `¿Cuántos ${producto.producto_nombre} deseas?, recuerda que su precio por unidad es S/ ${producto.producto_precio}.`;
                    }else{
                        response = respuesta.message;
                    };
                };
            };

            // Si escogimos un producto debemos ingresar la cantidad
            if(lastConvesation.conversacion_tipo == 'INSERT_CANTIDAD'){
                // Validamos si el cliente selecciono una cantidad
                if(!lastConvesation.cantidad){
                    console.log('[INSERT_CANTIDAD] -  no tenemos error, guardamos la conversacion');
                    respuesta = await utilityService.procesarMensajeCliente(parseMessage, lastConvesation.conversacion_tipo);
                    if(!respuesta.error){
                        // guardamos la conversacion
                        await dbService.createConversation({ 
                            clienteId: cliente.cliente_id , 
                            conversacion_mensaje: text,
                            cantidad: (text*1),
                            conversacion_tipo: utilityService.INSERT_PAGO,
                        });
                        const producto = await dbService.getProductById(lastConvesation.producto_id);
                        response = `Entonces desea ${(text*1)} ${producto.producto_nombre} , el precio para este producto es de S/ ${((producto.producto_precio*1) * (text*1))} por unidad, puede cancelar con yape, puede enviarnos el comprobante de pago por este medio.`;
                    }else{
                        response = respuesta.message;
                    };
                };
            };

            // validamos si el cliente selecciono un metodo de pago
            if(lastConvesation.conversacion_tipo == 'INSERT_PAGO'){
                // Validamos si el cliente selecciono un metodo de pago
                if(!lastConvesation.metodo_pago){
                    console.log('[INSERT_PAGO] -  no tenemos error, guardamos la conversacion');
                    respuesta = await utilityService.procesarMensajeCliente(parseMessage, lastConvesation.conversacion_tipo);
                    if(!respuesta.error){
                        // Capturamos la imgen de pago y la guardamos
                        response = "¡Gracias por tu compra! , tu pedido esta pagado.";

                        // guardamos la conversacion
                        await dbService.createConversation({ 
                            clienteId: cliente.cliente_id , 
                            conversacion_mensaje: 'Imagen de pago',
                            metodo_pago: opcion.title,
                            conversacion_tipo: utilityService.INIT_STATE,
                        });
                    }else{
                        response = respuesta.message;
                    };
                };
            }
            
            if(response){
                whatsappService.sendMessageWhatsap(response, number);

                if(enviarCategoria){
                    whatsappService.sendMessageListWhatsap(response, number);
                };

            }else{
                whatsappService.sendMessageListWhatsap(response, number, type , (opcion.id*1));
            };
        };

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