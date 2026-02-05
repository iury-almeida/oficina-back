import 'reflect-metadata';
import { createApp } from '../../src/app';
import { dataSource } from '../database/data-source';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Inicializar banco de dados
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log('✅ Database connected');
    }

    // Criar aplicação
    const app = createApp();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API documentation at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
