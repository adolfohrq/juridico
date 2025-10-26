import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import passport from './config/passport';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import prisma from './config/database';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Carregar variáveis de ambiente
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Função para executar seed inicial
async function runSeedIfNeeded() {
  try {
    // Verificar se já existem usuários no banco
    const userCount = await prisma.user.count();

    if (userCount === 0) {
      console.log('📊 Banco vazio detectado. Executando seed...');

      // Executar seed
      await execAsync('npx ts-node prisma/seed.ts');

      console.log('✅ Seed executado com sucesso!');
    } else {
      console.log(`✅ Banco já possui dados (${userCount} usuários)`);
    }
  } catch (error) {
    console.error('⚠️  Erro ao verificar/executar seed:', error);
    console.log('ℹ️  Continuando sem seed...');
  }
}

// Middlewares de segurança e parsing
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3005',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar Passport
app.use(passport.initialize());

// Rotas
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'SIGAJ API - Sistema de Gestão de Aprovações Jurídicas',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// Middleware de erro (deve ser o último)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);

  // Executar seed se necessário (apenas em produção)
  if (process.env.NODE_ENV === 'production') {
    await runSeedIfNeeded();
  }
});

export default app;
