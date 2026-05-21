import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 활성화
  app.enableCors();

  // Log raw body for troubleshooting malformed JSON from clients
  app.use(bodyParser.json({ limit: '10mb', verify: (req, res, buf) => { (req as any).rawBody = buf.toString(); } }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use((req, res, next) => {
    if (req.path && req.path.startsWith('/todos')) {
      console.log('[RAW BODY]', (req as any).rawBody);
      console.log('[CONTENT-TYPE]', req.headers['content-type']);
    }
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 필드 제거
      forbidNonWhitelisted: true, // DTO에 없는 필드 있으면 에러
      transform: true, // 자동 타입 변환
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
