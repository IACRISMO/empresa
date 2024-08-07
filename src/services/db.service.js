// USAMOS ORM PRISMA CON POSTGRESQL
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Obtenemos todos los clientes
async function getAllClients() {
    return await prisma.$queryRaw`SELECT * FROM cliente`;
    // return await prisma.cliente.findMany();
    // const prisma_ = new PrismaClient();
    // return await prisma_.cliente.findMany({
    //     select: {
    //       cliente_id: true,
    //       cliente_nombre: true,
    //       cliente_apellidos: true,
    //       cliente_dni: true,
    //       cliente_fechacreacion: true,
    //       cliente_telefono: true,

    //     },
    //   });
      
};

// Actualizamos cliente
async function updateClient(cliente_id, cliente) {
    // Actualizo con query directa
    // return await prisma.$queryRaw`UPDATE cliente SET cliente_nombre = ${cliente?.cliente_nombre}, cliente_apellidos = ${cliente?.cliente_apellido}, cliente_dni = ${cliente?.cliente_dni}, cliente_telefono = ${cliente?.cliente_telefono} WHERE cliente_id = ${cliente_id}`;
    return await prisma.$queryRaw`UPDATE cliente SET cliente_nombre = ${cliente?.cliente_nombre}, cliente_dni = ${cliente?.cliente_dni}, cliente_telefono = ${cliente?.cliente_telefono} WHERE cliente_id = ${cliente_id}`;

    // return await prisma.cliente.update({
    //     where: {
    //         cliente_id: cliente_id,
    //     },
    //     data: cliente,
    // });
};

// creamos cliente en bd
async function createClient(cliente) {
    // creo con query directa
    // await prisma.$queryRaw`INSERT INTO cliente (cliente_nombre, cliente_apellidos,cliente_dni,cliente_fechacreacion, cliente_telefono) VALUES (${cliente?.cliente_nombre}, ${cliente?.cliente_apellido},${cliente?.cliente_dni},${new Date()},${cliente?.cliente_telefono})`;
    await prisma.$queryRaw`INSERT INTO cliente (cliente_nombre,cliente_dni,cliente_fechacreacion, cliente_telefono) VALUES (${cliente?.cliente_nombre},${cliente?.cliente_dni},${new Date()},${cliente?.cliente_telefono})`;

     // Obtener el ID del cliente recién insertado
    const result = await prisma.$queryRaw`
        SELECT * 
        FROM cliente 
        ORDER BY cliente_fechacreacion DESC
        LIMIT 1
    `;

    return result[0];
    
    // creo con prisma
    // return await prisma.cliente.create({
    //     data: {
    //         cliente_dni: cliente?.cliente_dni,
    //         cliente_nombre: cliente?.cliente_nombre,
    //         cliente_apellido: cliente?.cliente_apellido,
    //         cliente_telefono: cliente?.cliente_telefono,
    //         cliente_email: cliente?.cliente_email,
    //     },
    // });
};

// obtenemos cliente por numero de telefono
async function getClientByPhone(cliente_telefono) {
    console.log('Buscando cliente con teléfono:', cliente_telefono);
    try {
        const cliente = await prisma.$queryRaw`SELECT * FROM cliente where cliente_telefono = ${cliente_telefono}`
        // const cliente = await prisma.cliente.findFirst({
        //     where: {
        //         cliente_telefono: '912345678'
        //     }
        // });
        return cliente && cliente.length > 0 ? cliente[0] : null;
    } catch (error) {
        console.error('Error al buscar cliente por teléfono:', error);
        // throw error;
        return null;
    };
};

// obtenemos cliente por dni
async function getClientByDni(cliente_dni) {
    return await prisma.cliente.findUnique({
        where: {
            cliente_dni: parseInt(cliente_dni),
        },
    });
};

// Obtenemos todos los servicios
async function getAllServices() {
    return await prisma.servicio.findMany();
};

// Obtener servicios por id
async function getServiceById(servicio_id) {
    let vector = await prisma.$queryRaw`SELECT * FROM servicio WHERE servicio_id = ${servicio_id}`;
    return vector && vector.length > 0 ? vector[0] : null;
};

// Obtenemos servicios por categoria_id
async function getServicesByCategoryId(categoria_id) {
    let vector = await prisma.$queryRaw`SELECT * FROM servicio WHERE categoria_id = ${categoria_id} ORDER BY servicio_id ASC`;
    return vector;
};

// Obtenemos productos por categoria_id
async function getProductsByCategoryId(categoria_id) {
    let vector = await prisma.$queryRaw`SELECT * FROM producto WHERE categoria_id = ${categoria_id} ORDER BY producto_id ASC`;
    return vector;
};

// obtenemos productos por servicioId
async function getProductsByServiceId(id) {
    return await prisma.producto.findMany({
        where: {
            servicioId: parseInt(id),
        },
    });
};

// Obtenemos todos los produtos
async function getAllProducts() {
    return await prisma.producto.findMany();
};

// Obtenemos productos por id
async function getProductById(producto_id) {
    let vector = await prisma.$queryRaw`SELECT * FROM producto WHERE producto_id = ${producto_id} limit 1`;
    return vector && vector.length > 0 ? vector[0] : null;
};

/* CONVERSACION */

// Creamos conversacion
async function createConversation(conversacion) {
    // creo con query directa
    return await prisma.$queryRaw`INSERT INTO conversacion (cliente_id,conversacion_fechacreacion,conversacion_mensaje,categoria_id,servicio_id,producto_id,conversacion_tipo)
    VALUES (${conversacion?.clienteId}, ${new Date()}, ${conversacion?.conversacion_mensaje}, ${conversacion?.categoria_id}, ${conversacion?.servicio_id}, ${conversacion?.producto_id}, ${conversacion?.conversacion_tipo})`;

    // creo con prisma
    // return await prisma.conversacion.create({
    //     data: {
    //         clienteId: conversacion?.clienteId,
    //         productoId: conversacion?.productoId,
    //         fecha: conversacion?.fecha,
    //         hora: conversacion?.hora,
    //         estado: conversacion?.estado,
    //     },
    // });
};

// Obtenemos conversacion por id
async function getConversationById(id) {
    return await prisma.conversacion.findUnique({
        where: {
            id: parseInt(id),
        },
    });
};

// Obtenemos todas las conversaciones
async function getAllConversations() {
    return await prisma.conversacion.findMany();
};

// Obtenemos conversaciones por clienteId
async function getConversationsByClientId(clienteId) {
    return await prisma.conversacion.findMany({
        where: {
            clienteId: parseInt(clienteId),
        },
    });
};

// Obtenemos el ultimo tipo o estado de conversacion que tuvo el cliente
async function getLastConversationByClientId(clienteId) {
    let  response = null;
    let vector = await prisma.$queryRaw`SELECT * FROM conversacion WHERE cliente_id = ${clienteId} AND conversacion_tipo IS NOT NULL ORDER BY conversacion_fechacreacion DESC LIMIT 1`;
    if(vector && vector.length > 0){
        response = vector[0];
    };
    return response;
};

/* CATEGORIAS */

// Obtenemos todas las categorias
async function getAllCategories() {
    return await prisma.categoria.findMany();
};




module.exports = {
    getProductById,
    getAllProducts,
    getClientByDni,
    createClient,
    getClientByPhone,
    getAllServices,
    getAllClients,
    createConversation,
    updateClient,
    getAllCategories,
    getLastConversationByClientId,
    getServicesByCategoryId,
    getProductsByCategoryId,
    getServiceById
};