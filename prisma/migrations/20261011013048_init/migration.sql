-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('COMUM', 'ADMIN');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "Porte" AS ENUM ('PEQUENO', 'MEDIO', 'GRANDE');

-- CreateEnum
CREATE TYPE "StatusAnimal" AS ENUM ('DISPONIVEL', 'EM_PROCESSO', 'ADOTADO');

-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('PENDENTE', 'APROVADO', 'RECUSADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nome_usuario" VARCHAR(100) NOT NULL,
    "email_usuario" VARCHAR(150) NOT NULL,
    "senha_usuario" VARCHAR(255) NOT NULL,
    "perfil_usuario" "Perfil" NOT NULL DEFAULT 'COMUM',
    "cep_usuario" CHAR(8) NOT NULL,
    "logradouro_usuario" VARCHAR(150),
    "bairro_usuario" VARCHAR(100),
    "cidade_usuario" VARCHAR(100) NOT NULL,
    "uf_usuario" CHAR(2) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "animal" (
    "id_animal" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nome_animal" VARCHAR(100) NOT NULL,
    "sexo_animal" "Sexo" NOT NULL,
    "data_nascimento" DATE,
    "castrado" BOOLEAN NOT NULL DEFAULT false,
    "vacinado" BOOLEAN NOT NULL DEFAULT false,
    "descricao" TEXT,
    "status_animal" "StatusAnimal" NOT NULL DEFAULT 'DISPONIVEL',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "animal_pkey" PRIMARY KEY ("id_animal")
);

-- CreateTable
CREATE TABLE "cachorro" (
    "id_animal" INTEGER NOT NULL,
    "porte_cachorro" "Porte" NOT NULL,
    "convive_com_cachorros" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cachorro_pkey" PRIMARY KEY ("id_animal")
);

-- CreateTable
CREATE TABLE "gato" (
    "id_animal" INTEGER NOT NULL,
    "testado_fiv_felv" BOOLEAN NOT NULL DEFAULT false,
    "convive_com_gatos" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "gato_pkey" PRIMARY KEY ("id_animal")
);

-- CreateTable
CREATE TABLE "pedido_adocao" (
    "id_pedido" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_animal" INTEGER NOT NULL,
    "status_pedido" "StatusPedido" NOT NULL DEFAULT 'PENDENTE',
    "motivo_adocao" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedido_adocao_pkey" PRIMARY KEY ("id_pedido")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_usuario_key" ON "usuario"("email_usuario");

-- CreateIndex
CREATE INDEX "animal_status_animal_idx" ON "animal"("status_animal");

-- CreateIndex
CREATE INDEX "pedido_adocao_id_animal_status_pedido_idx" ON "pedido_adocao"("id_animal", "status_pedido");

-- AddForeignKey
ALTER TABLE "animal" ADD CONSTRAINT "animal_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cachorro" ADD CONSTRAINT "cachorro_id_animal_fkey" FOREIGN KEY ("id_animal") REFERENCES "animal"("id_animal") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gato" ADD CONSTRAINT "gato_id_animal_fkey" FOREIGN KEY ("id_animal") REFERENCES "animal"("id_animal") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_adocao" ADD CONSTRAINT "pedido_adocao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_adocao" ADD CONSTRAINT "pedido_adocao_id_animal_fkey" FOREIGN KEY ("id_animal") REFERENCES "animal"("id_animal") ON DELETE CASCADE ON UPDATE CASCADE;
