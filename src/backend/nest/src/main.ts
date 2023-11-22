import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createServer } from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpServer = createServer(app.getHttpAdapter().getInstance());

  const ioAdapter = new IoAdapter({
    cors: {
      origin: 'http://localhost:5173', // Replace with your client's origin
      methods: ['GET', 'POST'],
    },
    path: '/socket.io'
  });
  app.useWebSocketAdapter(ioAdapter);

   // Enable CORS for the entire application
   app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  });
  
  await app.listen(3000);
}
bootstrap();
