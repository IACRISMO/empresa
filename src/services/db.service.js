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
    //   console.log(clientes);
      
}

// creamos cliente en bd
async function createClient(cliente) {
    // creo con query directa
    return await prisma.$queryRaw`INSERT INTO cliente ( cliente_nombre, cliente_apellido,cliente_dni,cliente_fechacreacion, cliente_telefono) VALUES (${cliente?.cliente_nombre}, ${cliente?.cliente_apellido},${cliente?.cliente_dni},${new Date()} ${cliente?.cliente_telefono})`;
    
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
}

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
        console.log('respuesta del query:', cliente);
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
async function getProductById(id) {
    return await prisma.producto.findUnique({
        where: {
            id: parseInt(id),
        },
    });
};

/* CONVERSACION */

// Creamos conversacion
async function createConversation(conversacion) {
    // creo con query directa
    return await prisma.$queryRaw`INSERT INTO conversacion (cliente_id,conversacion_fechacreacion,conversacion_mensaje) VALUES (${conversacion?.clienteId}, ${new Date()}, ${conversacion?.conversacion_mensaje})`;

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




module.exports = {
    getProductById,
    getAllProducts,
    getClientByDni,
    createClient,
    getClientByPhone,
    getAllServices,
    getAllClients,
    createConversation
};