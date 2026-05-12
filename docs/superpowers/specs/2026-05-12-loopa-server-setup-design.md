# Loopa Server 초기 세팅 설계

**프로젝트**: Loopa (당근마켓 클론)  
**목적**: NestJS 백엔드 학습 프로젝트 초기 세팅  
**날짜**: 2026-05-12  
**학습 단계**: 실습 2 (TODO CRUD API)부터 시작

---

## 📋 개요

Loopa 프로젝트의 server 폴더에서 NestJS 기반 백엔드를 학습하면서 진행합니다.

**범위 분리:**
- **내가 할 것**: 프로젝트 초기 세팅 (인프라, 설정, 폴더 구조)
- **사용자가 할 것**: 각 단계의 기능 구현 (Entity, Controller, Service 등)

---

## 🎯 초기 세팅 범위

### ✅ 내가 해줄 것 (Infrastructure)

1. **NestJS 프로젝트 초기화**
   - `nest new loopa-server` 실행
   - TypeScript, 테스트 환경 기본 설정

2. **폴더 구조 생성**
   - `src/todos/` (실습 2용)
   - `src/auth/` (실습 3용, 빈 폴더)
   - `src/common/` (공통 파일)
   - `src/config/` (설정)

3. **환경변수 관리**
   - `.env.example`: 템플릿 (도커 설정 제외)
   - 기본 설정값만 포함

4. **패키지 설치**
   - `@nestjs/*` 핵심 패키지
   - `typeorm`, `pg` (PostgreSQL)
   - `class-validator`, `class-transformer` (DTO 검증)
   - `bcrypt`, `@nestjs/jwt` (향후 인증용)
   - `socket.io` (향후 채팅용)
   - 테스트 환경 (Jest)

5. **기본 설정 파일**
   - `src/config/database.config.ts`: TypeORM 설정
   - `src/app.module.ts`: 루트 모듈 (ConfigModule, TypeOrmModule 등록)
   - `src/main.ts`: 앱 부트스트랩
   - `tsconfig.json`, `.gitignore`, `nest-cli.json`

6. **npm 스크립트**
   ```bash
   npm run dev        # 개발 서버 (watch mode)
   npm run build      # 빌드
   npm run start      # 운영 실행
   npm run test       # 테스트
   ```

---

### ❌ 사용자가 할 것 (Implementation)

1. **실습 2: TODO CRUD API**
   - `src/todos/entities/todo.entity.ts` (Entity 정의)
   - `src/todos/dto/` (CreateTodoDto, UpdateTodoDto 작성)
   - `src/todos/todos.controller.ts` (API 라우팅)
   - `src/todos/todos.service.ts` (비즈니스 로직)
   - `src/todos/todos.module.ts` (모듈 연결)

2. **실습 3: JWT 인증**
   - `src/auth/` 모듈 구현

3. **실습 4: Next.js 연동**
   - CORS 설정

4. **실습 5: Docker 운영 환경**
   - `docker-compose.prod.yml` 작성

---

## 🏗️ 프로젝트 구조

```
d:\작업실\study\projects\Loopa/
└── server/
    ├── src/
    │   ├── todos/                      # 실습 2: 사용자가 구현
    │   │   ├── dto/                    # (빈 폴더)
    │   │   │   ├── create-todo.dto.ts  # (사용자가 작성)
    │   │   │   └── update-todo.dto.ts
    │   │   ├── entities/               # (빈 폴더)
    │   │   │   └── todo.entity.ts      # (사용자가 작성)
    │   │   ├── todos.controller.ts     # (사용자가 작성)
    │   │   ├── todos.service.ts        # (사용자가 작성)
    │   │   └── todos.module.ts         # (사용자가 작성)
    │   ├── auth/                       # 실습 3용 (빈 폴더)
    │   ├── common/
    │   │   ├── filters/                # 예외 필터 (나중에)
    │   │   ├── interceptors/           # 인터셉터 (나중에)
    │   │   └── pipes/                  # 파이프 (나중에)
    │   ├── config/
    │   │   ├── database.config.ts      # ✅ 내가 작성
    │   │   └── constants.ts            # (필요할 때 추가)
    │   ├── app.module.ts               # ✅ 내가 기본 설정
    │   └── main.ts                     # ✅ 내가 작성
    ├── test/                           # e2e 테스트
    ├── .env.example                    # ✅ 내가 작성
    ├── .gitignore                      # ✅ 기본값
    ├── package.json                    # ✅ 내가 작성
    ├── tsconfig.json                   # ✅ 기본값
    ├── nest-cli.json                   # ✅ 기본값
    └── README.md                       # (선택사항)
```

---

## 🔧 환경변수 설정

### .env.example (템플릿)

```env
# App
NODE_ENV=development
PORT=3000

# Database (실제 PostgreSQL 연결정보는 나중에)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loopa_db
DB_USER=loopa_user
DB_PASSWORD=loopa_password
```

> **참고**: Docker 설정은 나중에 (중고거래 플랫폼 기능 추가할 때)
> Redis, MongoDB, Elasticsearch 환경변수도 그 때 추가

---

## 📦 패키지 설정

### 핵심 의존성

```json
{
  "name": "loopa-server",
  "version": "1.0.0",
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/jwt": "^12.0.1",
    "@nestjs/passport": "^10.0.3",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "typeorm": "^0.3.17",
    "pg": "^8.11.3",
    "redis": "^4.6.12",
    "mongodb": "^6.3.0",
    "bcrypt": "^5.1.1",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "socket.io": "^4.7.2"
  }
}
```

### npm 스크립트

```json
{
  "scripts": {
    "dev": "nest start --watch",
    "start": "node dist/main.js",
    "build": "nest build",
    "test": "jest",
    "test:watch": "jest --watch",
    "db:up": "docker-compose -f docker-compose.dev.yml up -d",
    "db:down": "docker-compose -f docker-compose.dev.yml down",
    "db:logs": "docker-compose -f docker-compose.dev.yml logs -f"
  }
}
```

---

## 🚀 실행 흐름

### 1단계: 초기 세팅 (내가 할 것)

```bash
# server 폴더 생성 및 NestJS 초기화
nest new loopa-server

# 기본 폴더 구조, 설정 파일, 패키지 설치
# 완료!
```

### 2단계: 개발 시작 (사용자가 할 것)

```bash
cd server

# 개발 서버 시작
npm run dev

# 이제 localhost:3000 접속 가능
# 사용자가 todos 모듈 구현 시작
```

> **참고**: PostgreSQL은 외부 DB 사용 또는 나중에 Docker로 연결

---

## 📚 학습 로드맵 연결

| 실습 | 구현 내용 | 주요 기술 | 상태 |
|---|---|---|---|
| **실습 2** | TODO CRUD API | NestJS, TypeORM, PostgreSQL | 🚀 지금 시작 |
| **실습 3** | JWT 인증 추가 | @nestjs/jwt, bcrypt, Guard | 다음 |
| **실습 4** | Next.js 연동 | CORS, 환경변수 | 나중 |
| **실습 5** | Docker 운영 환경 | docker-compose.prod.yml | 나중 |
| **메인** | Loopa 기능 추가 | Redis, MongoDB, Elasticsearch, Socket.io | 나중 |

---

## 🔍 Node.js 버전

**요구사항**: Node.js 20.11.x 이상

```bash
# 확인
node --version

# 설치 안 되어 있으면
# https://nodejs.org/ 에서 LTS 설치
```

---

## ✅ 완료 기준

세팅이 완료되면:

1. ✅ `server/` 폴더 구조 완성
2. ✅ `npm run dev` 실행 시 NestJS 서버 시작 (localhost:3000)
3. ✅ `.env.example` 파일 생성됨
4. ✅ 모든 필요한 패키지 설치됨
5. ✅ 사용자가 `todos` 모듈 구현 가능한 상태

---

## 📝 다음 단계

세팅 후 사용자는:

1. **Todo Entity 정의** (`src/todos/entities/todo.entity.ts`)
   - id, title, description, isDone, createdAt

2. **DTO 작성** (`src/todos/dto/`)
   - CreateTodoDto, UpdateTodoDto

3. **Controller & Service 구현**
   - GET /todos (목록)
   - POST /todos (생성)
   - PATCH /todos/:id (수정)
   - DELETE /todos/:id (삭제)

4. **Module 연결**
   - TodoModule을 AppModule에 import

이후 Swagger로 API 문서 자동생성까지 연결 가능.
