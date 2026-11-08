-- CreateTable
CREATE TABLE "foto_animal" (
    "id_foto" SERIAL NOT NULL,
    "id_animal" INTEGER NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "public_id" VARCHAR(255) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "foto_animal_pkey" PRIMARY KEY ("id_foto")
);

-- CreateIndex
CREATE INDEX "foto_animal_id_animal_idx" ON "foto_animal"("id_animal");

-- AddForeignKey
ALTER TABLE "foto_animal" ADD CONSTRAINT "foto_animal_id_animal_fkey" FOREIGN KEY ("id_animal") REFERENCES "animal"("id_animal") ON DELETE CASCADE ON UPDATE CASCADE;
