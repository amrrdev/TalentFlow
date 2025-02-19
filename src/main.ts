import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('TalentFlow')
    .setDescription(
      `TalentFlow API enables clients to post projects and receive bids from freelancers. 
      It integrates AI-driven recommendations to help freelancers optimize their bids and 
      assists clients in selecting the best proposals. The platform includes real-time 
      notifications, contract creation, and a WebSocket-based communication system 
      between clients and freelancers.
`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
