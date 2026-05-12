# Loopa Server NestJS 초기 세팅 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** NestJS 프로젝트 초기화 및 기본 설정으로 학습 프로젝트 준비 완료

**Architecture:** NestJS의 Module/Controller/Service 구조를 활용한 모듈식 설계. 설정은 ConfigModule로 중앙화하고, TypeORM으로 데이터베이스 계층 준비. 각 기능은 독립적인 모듈로 구분되어 학습 단계별로 추가 가능.

**Tech Stack:** NestJS 10.3, TypeScript 5.3, TypeORM 0.3, PostgreSQL, class-validator, class-transformer

---

## 📁 File Structure

```
server/
├── src/
│   ├── todos/                    (사용자 구현용 - 빈 폴더만)
│   ├── auth/                     (사용자 구현용 - 빈 폴더만)
│   ├── common/
│   │   ├── filters/              (빈 폴더)
│   │   ├── interceptors/         (빈 폴더)
│   │   └── pipes/                (빈 폴더)
│   ├── config/
│   │   └── database.config.ts    (TypeORM 설정)
│   ├── app.module.ts             (루트 모듈)
│   └── main.ts                   (앱 진입점)
├── test/                         (e2e 테스트)
├── .env.example                  (환경변수 템플릿)
├── .gitignore
├── package.json                  (설정 완료)
├── tsconfig.json
└── nest-cli.json
```

---

## 🚀 Tasks

### Task 1: NestJS 프로젝트 초기화

**Files:**
- Create: `d:\작업실\study\projects\Loopa\server/` (전체 프로젝트)

- [ ] **Step 1: NestJS 프로젝트 생성**

```bash
cd d:\작업실\study\projects\Loopa
nest new server
```

프롬프트:
```
? Which package manager would you like to use? npm
```

선택: `npm` 선택

- [ ] **Step 2: 프로젝트 폴더 확인**

```bash
cd server
dir src
```

예상 출력:
```
app.controller.spec.ts
app.controller.ts
app.service.ts
app.module.ts
main.ts
```

- [ ] **Step 3: 기본 git 커밋**

```bash
git add .
git commit -m "init: nestjs project initialization"
```

---

### Task 2: 기본 폴더 구조 생성

**Files:**
- Create: `src/todos/` (폴더)
- Create: `src/auth/` (폴더)
- Create: `src/common/filters/` (폴더)
- Create: `src/common/interceptors/` (폴더)
- Create: `src/common/pipes/` (폴더)
- Create: `src/config/` (폴더)
- Create: `.gitkeep` 파일들

- [ ] **Step 1: 폴더 생성**

```bash
mkdir src\todos
mkdir src\auth
mkdir src\common
mkdir src\common\filters
mkdir src\common\interceptors
mkdir src\common\pipes
mkdir src\config
```

- [ ] **Step 2: .gitkeep 파일 생성 (빈 폴더 유지용)**

```bash
# todos 폴더
echo $null > src\todos\.gitkeep
mkdir src\todos\dto
mkdir src\todos\entities
echo $null > src\todos\dto\.gitkeep
echo $null > src\todos\entities\.gitkeep

# auth 폴더
echo $null > src\auth\.gitkeep

# common 폴더
echo $null > src\common\filters\.gitkeep
echo $null > src\common\interceptors\.gitkeep
echo $null > src\common\pipes\.gitkeep
```

- [ ] **Step 3: 구조 확인**

```bash
tree src /F
```

또는 VS Code 파일 탐색기에서 `src/` 폴더 확인

- [ ] **Step 4: 커밋**

```bash
git add src
git commit -m "chore: create base folder structure"
```

---

### Task 3: .env.example 파일 작성

**Files:**
- Create: `.env.example`
- Create: `.env.local` (git 무시 - .gitignore에 추가)

- [ ] **Step 1: .gitignore 확인 및 수정**

현재 `.gitignore` 확인:

```bash
cat .gitignore
```

다음 내용이 있는지 확인 (없으면 추가):

```
.env
.env.local
.env.*.local
```

없으면 파일 끝에 추가:

```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 2: .env.example 파일 생성**

파일: `server/.env.example`

```env
# Application
NODE_ENV=development
PORT=3000

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loopa_db
DB_USER=loopa_user
DB_PASSWORD=loopa_password
```

- [ ] **Step 3: .env.local 파일 생성 (개발용)**

파일: `server/.env.local` (이 파일은 git 무시됨)

```env
# Application
NODE_ENV=development
PORT=3000

# Database (PostgreSQL) - 실제 연결할 DB 정보
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loopa_db
DB_USER=loopa_user
DB_PASSWORD=loopa_password
```

> **참고**: 실제 PostgreSQL 연결 정보는 사용자가 DB 설정 후 수정

- [ ] **Step 4: 커밋**

```bash
git add .env.example .gitignore
git commit -m "chore: add environment variable templates"
```

---

### Task 4: 필요 패키지 설치

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 현재 package.json 확인**

```bash
cat package.json
```

- [ ] **Step 2: 패키지 설치**

```bash
npm install @nestjs/config @nestjs/typeorm typeorm pg class-validator class-transformer bcrypt @nestjs/jwt @nestjs/passport passport passport-jwt socket.io
```

설치 예상 시간: 2-3분

- [ ] **Step 3: 설치 확인**

```bash
npm list @nestjs/config @nestjs/typeorm typeorm pg
```

예상 출력:
```
├── @nestjs/config@3.x.x
├── @nestjs/typeorm@10.x.x
├── typeorm@0.3.x
└── pg@8.x.x
```

- [ ] **Step 4: npm 스크립트 확인**

`package.json`의 `"scripts"` 섹션 확인:

```json
{
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main.js",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.jest/bin/jest.js --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

이미 있어야 함. 없으면 위 내용으로 수동 추가.

- [ ] **Step 5: 커밋**

```bash
git add package.json package-lock.json
git commit -m "chore: install required dependencies"
```

---

### Task 5: TypeORM 설정 파일 생성

**Files:**
- Create: `src/config/database.config.ts`

- [ ] **Step 1: database.config.ts 작성**

파일: `server/src/config/database.config.ts`

```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'loopa_user',
  password: process.env.DB_PASSWORD || 'loopa_password',
  database: process.env.DB_NAME || 'loopa_db',
  
  // 자동으로 entities 폴더의 모든 entity 인식
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  
  // 개발 환경에서만 자동 스키마 동기화
  synchronize: process.env.NODE_ENV === 'development',
  
  // SQL 쿼리 로깅
  logging: process.env.NODE_ENV === 'development',
});
```

- [ ] **Step 2: 파일 저장 및 확인**

```bash
cat src/config/database.config.ts
```

내용이 정확히 위와 일치하는지 확인

- [ ] **Step 3: 커밋**

```bash
git add src/config/database.config.ts
git commit -m "chore: add typeorm database configuration"
```

---

### Task 6: App Module 설정

**Files:**
- Modify: `src/app.module.ts`

- [ ] **Step 1: 현재 app.module.ts 확인**

```bash
cat src/app.module.ts
```

기본 내용:
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- [ ] **Step 2: app.module.ts 수정 (ConfigModule, TypeOrmModule 등록)**

파일: `server/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/database.config';

@Module({
  imports: [
    // 환경변수 설정 (전역으로 사용 가능)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    
    // TypeORM 설정
    TypeOrmModule.forRoot(typeOrmConfig()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- [ ] **Step 3: 문법 확인**

VS Code에서 파일 열어서 빨간 줄(에러) 없는지 확인

- [ ] **Step 4: 커밋**

```bash
git add src/app.module.ts
git commit -m "feat: configure ConfigModule and TypeOrmModule"
```

---

### Task 7: Main.ts 설정

**Files:**
- Modify: `src/main.ts`

- [ ] **Step 1: 현재 main.ts 확인**

```bash
cat src/main.ts
```

기본 내용:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

- [ ] **Step 2: main.ts 수정 (환경변수에서 포트 읽기)**

파일: `server/src/main.ts`

```typescript
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
```

- [ ] **Step 3: 문법 확인**

VS Code에서 파일 열어서 빨간 줄 없는지 확인

- [ ] **Step 4: 커밋**

```bash
git add src/main.ts
git commit -m "feat: add validation pipe and port configuration"
```

---

### Task 8: 개발 서버 실행 확인 (검증)

**Files:**
- Test: 브라우저/curl로 localhost:3000 접속

- [ ] **Step 1: 개발 서버 시작**

```bash
npm run dev
```

예상 출력:
```
[Nest] 12345  - 05/12/2026, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 05/12/2026, 10:30:00 AM     LOG [InstanceLoader] ConfigModule dependencies initialized +45ms
[Nest] 12345  - 05/12/2026, 10:30:01 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +123ms
[Nest] 12345  - 05/12/2026, 10:30:01 AM     LOG [InstanceLoader] AppModule dependencies initialized +5ms
[Nest] 12345  - 05/12/2026, 10:30:01 AM     LOG [NestApplication] Nest application successfully started
Server running on http://localhost:3000
```

> **중요**: PostgreSQL이 없으면 TypeORM 연결 에러가 발생할 수 있음. 
> 현재는 서버만 시작되면 OK. (DB 설정은 나중에)

- [ ] **Step 2: API 테스트 (다른 터미널에서)**

```bash
curl http://localhost:3000
```

또는 브라우저에서 `http://localhost:3000` 접속

예상 응답:
```json
{"message":"Welcome to loopa-server!"}
```

(또는 app.service.ts의 내용에 따라 다를 수 있음)

- [ ] **Step 3: 로그 확인**

터미널에서 다음과 같은 로그가 나타나야 함:
```
[Nest] ... LOG [InstanceLoader] TypeOrmModule dependencies initialized
```

이는 TypeORM이 성공적으로 로드됐음을 의미.

- [ ] **Step 4: 서버 중지**

```bash
Ctrl + C
```

- [ ] **Step 5: 최종 커밋**

```bash
git add .
git commit -m "chore: verify development server startup"
```

---

## ✅ 완료 기준

세팅이 완료되면:

1. ✅ `server/` 폴더 구조 완성 (todos, auth, common, config 등)
2. ✅ `npm run dev` 실행 시 NestJS 서버 정상 시작 (localhost:3000)
3. ✅ `.env.example`, `.env.local` 파일 생성
4. ✅ TypeORM 설정 완료 (database.config.ts)
5. ✅ ConfigModule, TypeOrmModule 등록 완료
6. ✅ 모든 필요 패키지 설치됨

---

## 📝 다음 단계

세팅 완료 후 사용자가 할 작업:

1. **PostgreSQL 설정** (외부 DB 또는 Docker)
2. **Todo Entity 정의** (`src/todos/entities/todo.entity.ts`)
3. **DTO 작성** (`src/todos/dto/create-todo.dto.ts`, `update-todo.dto.ts`)
4. **TodoController, TodoService 구현**
5. **TodoModule 작성 및 AppModule에 등록**
