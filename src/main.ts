import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { INestApplication, ValidationPipe } from '@nestjs/common';

function setupCors(app: INestApplication) {
  app.enableCors({
    origin: process.env.CORS_ORIGIN || undefined,
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS || undefined,
    exposedHeaders: process.env.CORS_EXPOSED_HEADERS || undefined,
    credentials: process.env.CORS_CREDENTIALS === 'true',
    maxAge: process.env.CORS_MAX_AGE
      ? parseInt(process.env.CORS_MAX_AGE)
      : undefined,
    methods: process.env.CORS_METHODS!.split(','),
  });
}

function setupSwagger(app: INestApplication) {
  const swaggerBuilder = new DocumentBuilder()
    .setTitle('HiveMind API')
    .setDescription('The HiveMind API specification')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerBuilder);

  SwaggerModule.setup('api-docs', app, swaggerDocument);

  app.use('/swagger.json', (_: Request, res: Response) => {
    res.json(swaggerDocument);
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  setupCors(app);

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 80, process.env.HOST!);
}

bootstrap();
