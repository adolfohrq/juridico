import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (cuidado em produção!)
  if (process.env.NODE_ENV === 'development') {
    await prisma.comentario.deleteMany();
    await prisma.logAtividade.deleteMany();
    await prisma.documento.deleteMany();
    await prisma.atribuicao.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.user.deleteMany();
  }

  // Hash da senha padrão
  const hashedPassword = await bcrypt.hash('senha123', 10);

  // Criar usuários
  const diretor = await prisma.user.create({
    data: {
      email: 'diretor@sigaj.com',
      password: hashedPassword,
      full_name: 'João Silva',
      cargo: 'DIRETOR_JURIDICO',
      setor: 'Direção Jurídica',
      ativo: true,
    },
  });

  const viceDiretor = await prisma.user.create({
    data: {
      email: 'vice@sigaj.com',
      password: hashedPassword,
      full_name: 'Maria Santos',
      cargo: 'VICE_DIRETOR_JURIDICO',
      setor: 'Direção Jurídica',
      ativo: true,
    },
  });

  const chefe = await prisma.user.create({
    data: {
      email: 'chefe@sigaj.com',
      password: hashedPassword,
      full_name: 'Pedro Oliveira',
      cargo: 'CHEFE_DIVISAO',
      setor: 'Divisão de Contratos',
      ativo: true,
    },
  });

  const tecnico1 = await prisma.user.create({
    data: {
      email: 'tecnico1@sigaj.com',
      password: hashedPassword,
      full_name: 'Ana Costa',
      cargo: 'TECNICO',
      setor: 'Divisão de Contratos',
      ativo: true,
    },
  });

  const tecnico2 = await prisma.user.create({
    data: {
      email: 'tecnico2@sigaj.com',
      password: hashedPassword,
      full_name: 'Carlos Ferreira',
      cargo: 'TECNICO',
      setor: 'Divisão de Contratos',
      ativo: true,
    },
  });

  console.log('✅ Usuários criados');

  // Criar pedidos de exemplo
  const pedido1 = await prisma.pedido.create({
    data: {
      titulo: 'Análise de Contrato de Prestação de Serviços',
      descricao: 'Revisar cláusulas do contrato de prestação de serviços com a empresa XYZ',
      status: 'EM_EXECUCAO',
      prioridade: 'ALTA',
      prazo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      numero_processo: '2025/001',
      criado_por_id: diretor.id,
    },
  });

  const pedido2 = await prisma.pedido.create({
    data: {
      titulo: 'Parecer sobre Licitação Pública',
      descricao: 'Elaborar parecer jurídico sobre processo licitatório nº 123/2025',
      status: 'PENDENTE',
      prioridade: 'URGENTE',
      prazo: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias
      numero_processo: '2025/002',
      criado_por_id: viceDiretor.id,
    },
  });

  const pedido3 = await prisma.pedido.create({
    data: {
      titulo: 'Revisão de Edital',
      descricao: 'Revisar edital de concurso público conforme legislação vigente',
      status: 'AGUARDANDO_APROVACAO',
      prioridade: 'MEDIA',
      prazo: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias
      numero_processo: '2025/003',
      criado_por_id: chefe.id,
    },
  });

  const pedido4 = await prisma.pedido.create({
    data: {
      titulo: 'Análise de Recurso Administrativo',
      descricao: 'Analisar recurso administrativo interposto contra decisão do setor',
      status: 'CONCLUIDO',
      prioridade: 'BAIXA',
      numero_processo: '2024/456',
      criado_por_id: chefe.id,
      concluido_em: new Date(),
    },
  });

  console.log('✅ Pedidos criados');

  // Criar atribuições
  await prisma.atribuicao.createMany({
    data: [
      {
        pedido_id: pedido1.id,
        user_id: tecnico1.id,
        cargo_responsavel: 'TECNICO',
        observacao: 'Responsável pela análise inicial',
      },
      {
        pedido_id: pedido2.id,
        user_id: tecnico2.id,
        cargo_responsavel: 'TECNICO',
        observacao: 'Urgente - priorizar',
      },
      {
        pedido_id: pedido3.id,
        user_id: tecnico1.id,
        cargo_responsavel: 'TECNICO',
      },
    ],
  });

  console.log('✅ Atribuições criadas');

  // Criar logs de atividade
  await prisma.logAtividade.createMany({
    data: [
      {
        pedido_id: pedido1.id,
        user_id: diretor.id,
        tipo: 'CRIACAO',
        descricao: 'Pedido criado',
      },
      {
        pedido_id: pedido1.id,
        user_id: diretor.id,
        tipo: 'ATRIBUICAO',
        descricao: 'Pedido atribuído a Ana Costa',
      },
      {
        pedido_id: pedido1.id,
        user_id: tecnico1.id,
        tipo: 'ATUALIZACAO',
        descricao: 'Status alterado para EM_EXECUCAO',
      },
      {
        pedido_id: pedido2.id,
        user_id: viceDiretor.id,
        tipo: 'CRIACAO',
        descricao: 'Pedido criado com prioridade URGENTE',
      },
      {
        pedido_id: pedido3.id,
        user_id: chefe.id,
        tipo: 'CRIACAO',
        descricao: 'Pedido criado',
      },
      {
        pedido_id: pedido3.id,
        user_id: tecnico1.id,
        tipo: 'ATUALIZACAO',
        descricao: 'Análise concluída, aguardando aprovação',
      },
      {
        pedido_id: pedido4.id,
        user_id: chefe.id,
        tipo: 'CRIACAO',
        descricao: 'Pedido criado',
      },
      {
        pedido_id: pedido4.id,
        user_id: diretor.id,
        tipo: 'CONCLUSAO',
        descricao: 'Pedido concluído',
      },
    ],
  });

  console.log('✅ Logs de atividade criados');

  // Criar comentários
  await prisma.comentario.createMany({
    data: [
      {
        pedido_id: pedido1.id,
        user_id: tecnico1.id,
        conteudo: 'Iniciando análise das cláusulas contratuais.',
      },
      {
        pedido_id: pedido1.id,
        user_id: diretor.id,
        conteudo: 'Por favor, dar atenção especial às cláusulas de rescisão.',
      },
      {
        pedido_id: pedido2.id,
        user_id: tecnico2.id,
        conteudo: 'Verificando conformidade com a Lei 8.666/93.',
      },
      {
        pedido_id: pedido3.id,
        user_id: tecnico1.id,
        conteudo: 'Revisão finalizada. Aguardando aprovação final.',
      },
    ],
  });

  console.log('✅ Comentários criados');

  console.log('\n🎉 Seed concluído com sucesso!\n');
  console.log('📧 Credenciais de teste:');
  console.log('-----------------------------------');
  console.log('Diretor:     diretor@sigaj.com');
  console.log('Vice:        vice@sigaj.com');
  console.log('Chefe:       chefe@sigaj.com');
  console.log('Técnico 1:   tecnico1@sigaj.com');
  console.log('Técnico 2:   tecnico2@sigaj.com');
  console.log('Senha:       senha123');
  console.log('-----------------------------------\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
