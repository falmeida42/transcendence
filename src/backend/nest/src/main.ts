import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import { createAI } from './prisma/ai';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const corsOptions: CorsOptions = {
  //   origin: ['http://10.12.8.6:5173'],
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: 'Content-Type, Authorization',
  //   credentials: true,
  // };

  await createAI();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  app.enableCors({
    origin: 'http://10.12.8.6:5173',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
