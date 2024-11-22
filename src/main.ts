import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';

function setupSwagger(app: Parameters<typeof SwaggerModule.createDocument>[0]) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('HiveMind API')
    .setDescription('The HiveMind API specification')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, swaggerDocument);

  app.use('/swagger.json', (_: Request, res: Response) => {
    res.json(swaggerDocument);
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 80);
}
bootstrap();
