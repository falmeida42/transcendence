import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const ioAdapter = new IoAdapter(app);
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
