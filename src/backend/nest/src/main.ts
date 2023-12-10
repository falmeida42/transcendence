import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as passport from 'passport';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  // // Session based authentication
  // app.use(
  //   session({
  //     secret: 'keyboard',
  //     resave: false,
  //     saveUninitialized: false,
  //   }),
  // );
  app.use(passport.initialize());
  // app.use(passport.session());

  app.enableCors(corsOptions);
  // app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
