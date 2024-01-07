import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { FTAuthExceptionFilter } from './filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);
  app.useGlobalFilters(new FTAuthExceptionFilter());
  await app.listen(3000);
}
bootstrap();
