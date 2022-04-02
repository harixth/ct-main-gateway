import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://www.cryptotraker.xyz',
      'https://cryptotraker.vercel.app',
    ],
    credentials: true,
  });
  app.use(
    session({
      cookie: {
        maxAge: 86400000,
      },
      secret: 'secretKey',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  const PORT = process.env.PORT || 4000;
  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`Main Gateway is running on port ${PORT}`);
  });
}
bootstrap();
