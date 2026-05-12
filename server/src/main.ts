import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 ValidationPipe 등록 (DTO 검증용)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  // DTO에 없는 필드 제거
      forbidNonWhitelisted: true,  // DTO에 없는 필드 있으면 에러
      transform: true,  // 자동 타입 변환
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
