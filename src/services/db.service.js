// USAMOS ORM PRISMA CON POSTGRESQL
const { PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

// creamos cliente en bd
async function createClient(cliente) {
    return await prisma.cliente.create({
        data: {
            cliente_dni: cliente?.cliente_dni,
            cliente_nombre: cliente?.cliente_nombre,
            cliente_apellido: cliente?.cliente_apellido,
            cliente_telefono: cliente?.cliente_telefono,
            cliente_email: cliente?.cliente_email,
        },
    });
}

// obtenemos cliente por numero de telefono
async function getClientByPhone(cliente_telefono) {

    const prisma_ = new PrismaClient();

    return await prisma_.cliente.findUnique({
        where: {
            cliente_telefono: cliente_telefono,
        },
    });
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


module.exports = {
    getProductById,
    getAllProducts,
    getClientByDni,
    createClient,
    getClientByPhone,
    getAllServices
};