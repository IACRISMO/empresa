// Importamos el servicio de base de datos
const dbService = require('../services/db.service');

function esNombreValido(nombre) {
  // Expresión regular para validar nombres
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;

  // Lista de malas palabras
  const malasPalabras = ["huachafo", "pata", "chamba", "cholo", "causa", "jato",
   "floro", "fercho", "cacharro", "zampón", "chela", "pucha", "cachanga",
    "chibolo", "achorado", "huevón", "huasca", "joroba", "pichanga", "calato", 
    "trome", "cañazo", "jarana", "caleta", "tombo", "manya", "fugaz", "mostro",
    "caer", "jamear", "pisco", "mostasero", "yara", "chacra", "sapear", "lorna",
    "plop", "yanqui", "combi", "bamba", "palteado", "jorobar", "paltas", "flaca",
    "churre", "putear", "conchudo", "jalador", "wawita", "jirón", "broder", "fiesta",
    "chongo", "huaracazo", "charapa", "pendejo", "cachina", "calabaza", "pegalón",
    "paiche", "bacán", "cabro", "cancha", "carajo", "choro", "pana", "guachimán", 
    "yuca", "melcocha", "pitri mitri", "fulano", "huaco", "zapatilla", "mote", 
    "huachafería", "jeropa", "tocayo", "tarumba", "jachudo", "guachimanear", 
    "tambo", "changa", "huaralino", "chifar", "pituco", "chancaca", "salud", 
    "zafacasa", "mañas", "fierro", "huaranga", "zaraza", "pato", "mierda",
    "zorra", "paletear", "chato", "charapa"];  // Sustituye con la lista real

  // Primero, validamos que el nombre cumpla con la expresión regular
  if (!regex.test(nombre)) {
      return false;
  }
  
  // Luego, verificamos que no contenga malas palabras
  for (let palabra of malasPalabras) {
      if (nombre.toLowerCase().includes(palabra.toLowerCase())) {
          return false;
      }
  }
  
  return true;
};

// Expresión regular para validar un número de 8 dígitos
function esDniValido(numero) {
    const regex = /^\d{8}$/;
    return regex.test(numero);
};

// Función para obtener un listado de categorías
async function obtenerListadoCategoriasWPP() {
    let vector = [];
    let response = {
        header_txt: 'Polivet',
        body_txt: 'Por favor selecciona el servicio que deseas.',
        footer_txt: 'Gracias por elegir Polivet.',
        button_txt: 'Categorias',
        list: []
    };
    // Obtenemos las categorías de la base de datos
    vector = await dbService.getAllCategories();
    // recorro el vector y lo parseo para wpp asi id y title
    vector = vector.map((item) => {
        return {
            id: item.categoria_id,
            title: item.categoria_nombre,
            description: ""
        };
    });
    response.list = vector;
    return response;
};

// Función para obtener un listado de servicios
async function obtenerListadoServiciosWPP(categoria_id) {
    let vector = [];
    let response = {
        header_txt: 'Polivet',
        body_txt: 'Por favor selecciona el servicio que deseas.',
        footer_txt: 'Gracias por elegir Polivet.',
        button_txt: 'Servicios',
        list: []
    };
    // Obtenemos los servicios de la base de datos
    vector = await dbService.getServicesByCategoryId(categoria_id);
    // recorro el vector y lo parseo para wpp asi id y title
    vector = vector.map((item) => {
        return {
            id: item.servicio_id,
            title: item.servicio_nombre,
            description: ""
        };
    });
    response.list = vector;
    return response;
};

// Función para obtener un listado de productos
async function obtenerListadoProductosWPP(categoria_id) {
    let vector = [];
    let response = {
        header_txt: 'Polivet',
        body_txt: 'Por favor selecciona el producto que deseas.',
        footer_txt: 'Gracias por elegir Polivet.',
        button_txt: 'Productos',
        list: []
    };
    // Obtenemos los productos de la base de datos
    vector = await dbService.getProductsByCategoryId(categoria_id);
    // recorro el vector y lo parseo para wpp asi id y title
    vector = vector.map((item) => {
        return {
            id: item.producto_id,
            title: item.producto_nombre,
            description: ""
        };
    });
    response.list = vector;
    return response;
};

// Función para validar el mensaje del cliente y procesarlo
async function procesarMensajeCliente(parseMessage, tipo_message) {

    let response = {
        error: false,
        message: '',
        servicioOrProducto: 'INSERT_SERVICIO',
    };

    if(tipo_message ===  'INSERT_CATEGORIA'){
        if(parseMessage.typeMessage !== 'interactive'){
            response.message = 'Por favor selecciona una categoria.';
            response.error = true;
        }else{
            
            if (['1', '2', '3', '5'].includes(parseMessage.opcion.id)){
               response.servicioOrProducto = 'INSERT_PRODUCTO'
            }else{
               response.servicioOrProducto = 'INSERT_SERVICIO';
            };
        }
    };

    if(tipo_message ===  'INSERT_SERVICIO'){
        if(parseMessage.typeMessage !== 'interactive'){
            response.message = 'Por favor selecciona un servicio.';
            response.error = true;
        };
    };

    if(tipo_message ===  'INSERT_PRODUCTO'){
        if(parseMessage.typeMessage !== 'interactive'){
            response.message = 'Por favor selecciona un producto.';
            response.error = true;
        };
    };

    if(tipo_message ===  'INSERT_CANTIDAD'){
        if(parseMessage.typeMessage == 'text'){
            // Validamos si no es valor numerico positivo mayor de 0 
            if( !parseInt(parseMessage.text) || parseInt(parseMessage.text) < 0 ){
                response.message = 'Por favor ingresa una cantidad valida.';
                response.error = true;
            }else{

            }
        };
    }

    if(tipo_message ===  'INSERT_PAGO'){
        if(parseMessage.typeMessage !== 'image'){
            response.message = 'Por favor envia una imagen de tu pago.';
            response.error = true;
        };
    }

    return response;
};


module.exports = {
    esNombreValido,
    esDniValido,
    obtenerListadoCategoriasWPP,
    obtenerListadoServiciosWPP,
    obtenerListadoProductosWPP,
    procesarMensajeCliente,
    // Mensajes Predeterminados posibles
    MENSAJE_BIENVENIDA: '¿Que tipo de servicio necesitas?',
    MENSAJE_NOMBRE_INVALIDO: 'Nombre invalido, por favor ingrese un nombre valido.',
    MENSAJE_DNI_INVALIDO: 'DNI invalido, por favor ingrese un DNI valido.',
    MENSAJE_CONSULTA: 'Ahora puedo ayudarte con tu consulta, ¿qué tipo de servicio necesitas?',
    // Tipo de mensajes insertados por sistema
    INIT_STATE: 'INIT_STATE',
    INSERT_CATEGORIA: 'INSERT_CATEGORIA',
    INSERT_SERVICIO: 'INSERT_SERVICIO',
    INSERT_PRODUCTO: 'INSERT_PRODUCTO',
    INSERT_CANTIDAD: 'INSERT_CANTIDAD',
    INSERT_PAGO: 'INSERT_PAGO',

    // Estados posibles de la conversación
    REGISTRO: 1,
    SERVICIO: 2,
    PRODUCTO : 3,
    PAGO: 4,

};

