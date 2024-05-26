-- CreateTable
CREATE TABLE "producto" (
    "producto_id" SERIAL NOT NULL,
    "producto_nombre" VARCHAR(100),
    "categoria_id" INTEGER,
    "producto_precio" DECIMAL(10,2),
    "producto_descripcion" VARCHAR(255),
    "producto_stock" INTEGER,
    "producto_fechacreacion" DATE,
    "fecha_de_vencimiento" DATE,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("producto_id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "categoria_id" SERIAL NOT NULL,
    "categoria_nombre" VARCHAR(100),
    "categoria_fechacreacion" DATE,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("categoria_id")
);

-- CreateTable
CREATE TABLE "cliente" (
    "cliente_id" SERIAL NOT NULL,
    "cliente_nombre" VARCHAR(100),
    "cliente_apellidos" VARCHAR(100),
    "cliente_dni" INTEGER,
    "cliente_direccion" VARCHAR(255),
    "cliente_fechacreacion" DATE,
    "cliente_telefono" VARCHAR(15),

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("cliente_id")
);

-- CreateTable
CREATE TABLE "conversacion" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER,
    "conversacion_fechacreacion" DATE,

    CONSTRAINT "conversacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicio" (
    "servicio_id" SERIAL NOT NULL,
    "servicio_nombre" VARCHAR(100),
    "categoria_id" INTEGER,
    "servicio_fechacreacion" DATE,

    CONSTRAINT "servicio_pkey" PRIMARY KEY ("servicio_id")
);

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("categoria_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversacion" ADD CONSTRAINT "conversacion_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("cliente_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("categoria_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
