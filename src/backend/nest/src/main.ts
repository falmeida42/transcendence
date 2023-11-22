import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createServer } from 'http';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the entire application
  app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  }));

  const httpServer = createServer(app.getHttpAdapter().getInstance());

  const ioAdapter = new IoAdapter(httpServer);
  app.useWebSocketAdapter(ioAdapter);

  await app.listen(3000);
}

bootstrap();
