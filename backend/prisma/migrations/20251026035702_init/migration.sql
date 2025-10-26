-- CreateEnum
CREATE TYPE "CargoEnum" AS ENUM ('DIRETOR_JURIDICO', 'VICE_DIRETOR_JURIDICO', 'CHEFE_DIVISAO', 'TECNICO');

-- CreateEnum
CREATE TYPE "StatusPedidoEnum" AS ENUM ('PENDENTE', 'EM_ANALISE', 'EM_EXECUCAO', 'AGUARDANDO_APROVACAO', 'APROVADO', 'DEVOLVIDO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "PrioridadeEnum" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "TipoAtividadeEnum" AS ENUM ('CRIACAO', 'ATUALIZACAO', 'APROVACAO', 'DEVOLUCAO', 'ATRIBUICAO', 'COMENTARIO', 'UPLOAD_DOCUMENTO', 'CONCLUSAO');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "full_name" TEXT NOT NULL,
    "cargo" "CargoEnum" NOT NULL,
    "setor" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "google_id" TEXT,
    "avatar_url" TEXT,
    "refresh_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" "StatusPedidoEnum" NOT NULL DEFAULT 'PENDENTE',
    "prioridade" "PrioridadeEnum" NOT NULL DEFAULT 'MEDIA',
    "prazo" TIMESTAMP(3),
    "numero_processo" TEXT,
    "criado_por_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "concluido_em" TIMESTAMP(3),

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atribuicoes" (
    "id" SERIAL NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cargo_responsavel" "CargoEnum" NOT NULL,
    "observacao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "atribuicoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" SERIAL NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_atividade" (
    "id" SERIAL NOT NULL,
    "pedido_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "tipo" "TipoAtividadeEnum" NOT NULL,
    "descricao" TEXT NOT NULL,
    "metadata" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_atividade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comentarios" (
    "id" SERIAL NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "conteudo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_numero_processo_key" ON "pedidos"("numero_processo");

-- CreateIndex
CREATE UNIQUE INDEX "atribuicoes_pedido_id_user_id_key" ON "atribuicoes"("pedido_id", "user_id");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_criado_por_id_fkey" FOREIGN KEY ("criado_por_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atribuicoes" ADD CONSTRAINT "atribuicoes_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atribuicoes" ADD CONSTRAINT "atribuicoes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_atividade" ADD CONSTRAINT "logs_atividade_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_atividade" ADD CONSTRAINT "logs_atividade_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
