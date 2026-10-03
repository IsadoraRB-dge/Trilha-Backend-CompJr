-- CreateEnum
CREATE TYPE "StatusAdocao" AS ENUM ('PENDENTE', 'APROVADO', 'RECUSADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "SexoAnimal" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "PorteCachorro" AS ENUM ('PEQUENO', 'MEDIO', 'GRANDE');

-- CreateTable
CREATE TABLE "usuario" (
    "idusuarios" SERIAL NOT NULL,
    "nome_usuario" VARCHAR(100) NOT NULL,
    "email_usuario" VARCHAR(100) NOT NULL,
    "senha_usuario" VARCHAR(255) NOT NULL,
    "cep_usuario" CHAR(8) NOT NULL,
    "logradouro_usuario" VARCHAR(100) NOT NULL,
    "bairro_usuario" VARCHAR(100) NOT NULL,
    "cidade_usuario" VARCHAR(45) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("idusuarios")
);

-- CreateTable
CREATE TABLE "pedidos_adocao" (
    "ids" SERIAL NOT NULL,
    "status_adocao" "StatusAdocao" NOT NULL DEFAULT 'PENDENTE',
    "motivo_adocao" TEXT NOT NULL,

    CONSTRAINT "pedidos_adocao_pkey" PRIMARY KEY ("ids")
);

-- CreateTable
CREATE TABLE "usuario_has_pedidos_adocao" (
    "usuario_idusuarios" INTEGER NOT NULL,
    "pedidos_adocao_ids" INTEGER NOT NULL,

    CONSTRAINT "usuario_has_pedidos_adocao_pkey" PRIMARY KEY ("usuario_idusuarios","pedidos_adocao_ids")
);

-- CreateTable
CREATE TABLE "pedidos_adocao_has_animal" (
    "pedidos_adocao_ids" INTEGER NOT NULL,
    "animal_id_animal" INTEGER NOT NULL,

    CONSTRAINT "pedidos_adocao_has_animal_pkey" PRIMARY KEY ("pedidos_adocao_ids","animal_id_animal")
);

-- CreateTable
CREATE TABLE "animal" (
    "id_animal" SERIAL NOT NULL,
    "nome_animal" VARCHAR(45) NOT NULL,
    "sexo_animal" "SexoAnimal" NOT NULL,
    "castrado" BOOLEAN NOT NULL,
    "vacinado" BOOLEAN NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "animal_pkey" PRIMARY KEY ("id_animal")
);

-- CreateTable
CREATE TABLE "gato" (
    "animal_id_animal" INTEGER NOT NULL,
    "testado_fiv_felv" INTEGER NOT NULL,
    "convive_com_gatos" VARCHAR(45) NOT NULL,

    CONSTRAINT "gato_pkey" PRIMARY KEY ("animal_id_animal")
);

-- CreateTable
CREATE TABLE "cachorro" (
    "animal_id_animal" INTEGER NOT NULL,
    "porte_cachorro" "PorteCachorro" NOT NULL,
    "convive_com_cachorros" BOOLEAN NOT NULL,

    CONSTRAINT "cachorro_pkey" PRIMARY KEY ("animal_id_animal")
);

-- AddForeignKey
ALTER TABLE "usuario_has_pedidos_adocao" ADD CONSTRAINT "usuario_has_pedidos_adocao_usuario_idusuarios_fkey" FOREIGN KEY ("usuario_idusuarios") REFERENCES "usuario"("idusuarios") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_has_pedidos_adocao" ADD CONSTRAINT "usuario_has_pedidos_adocao_pedidos_adocao_ids_fkey" FOREIGN KEY ("pedidos_adocao_ids") REFERENCES "pedidos_adocao"("ids") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_adocao_has_animal" ADD CONSTRAINT "pedidos_adocao_has_animal_pedidos_adocao_ids_fkey" FOREIGN KEY ("pedidos_adocao_ids") REFERENCES "pedidos_adocao"("ids") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_adocao_has_animal" ADD CONSTRAINT "pedidos_adocao_has_animal_animal_id_animal_fkey" FOREIGN KEY ("animal_id_animal") REFERENCES "animal"("id_animal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gato" ADD CONSTRAINT "gato_animal_id_animal_fkey" FOREIGN KEY ("animal_id_animal") REFERENCES "animal"("id_animal") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cachorro" ADD CONSTRAINT "cachorro_animal_id_animal_fkey" FOREIGN KEY ("animal_id_animal") REFERENCES "animal"("id_animal") ON DELETE CASCADE ON UPDATE CASCADE;
