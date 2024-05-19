// USAMOS ORM PRISMA CON POSTGRESQL
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

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
    getAllProducts
};