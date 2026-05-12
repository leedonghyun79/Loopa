# Loopa

Loopa 프로젝트의 메인 레포지토리입니다.

## 프로젝트 구조

```text
src/
├── common/         # 공통 인프라 코드
│   ├── filters/    # 예외 처리 필터
│   ├── guards/     # 인증 및 권한 가드
│   ├── interceptors/# 응답 가공 인터셉터
│   ├── pipes/      # 데이터 검증 및 변환 파이프
│   └── utils/      # 공통 도움 함수
├── config/         # 시스템 및 데이터베이스 설정
├── domain/         # 핵심 비즈니스 로직 (도메인별 모듈)
│   ├── auth/       # 인증 관련 기능
│   └── todos/      # 투두리스트 관련 기능
├── app.module.ts   # 최상위 모듈 (전체 조립)
└── main.ts         # 애플리케이션 시작점
```

## 시작하기 (백엔드)

### 1. 환경 변수 설정
`server/` 폴더 내에 `.env.local` 파일을 생성하고 다음 내용을 설정하세요.

```env
# Application
NODE_ENV=development
PORT=3000

# Database (PostgreSQL - 운영 시 사용)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=loopa_db
# DB_USER=loopa_user
# DB_PASSWORD=loopa_password

# Database (SQLite - 개발 시 사용)
DB_TYPE=better-sqlite3
DB_DATABASE=database.db
```

### 2. 의존성 설치 및 실행
```bash
cd server
npm install
npm run start:dev
```

## 데이터베이스
현재 로컬 개발 환경에서는 **SQLite (better-sqlite3)**를 사용하며, 데이터는 `server/database.db` 파일에 저장됩니다.
