// USAMOS ORM PRISMA CON POSTGRESQL
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

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
    getClientByDni
};