import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export const typeOrmConfig = (): TypeOrmModuleOptions => {
  // 자동으로 entities 폴더의 모든 entity 인식
  const entities = [path.join(__dirname, '../**/*.entity{.ts,.js}')];

  // 환경변수에서 DB_TYPE 확인 (SQLite 또는 PostgreSQL)
  const dbType = process.env.DB_TYPE as any;

  // 개발 환경에서 SQLite 메모리 DB 사용
  if (dbType === 'better-sqlite3') {
    return {
      type: 'better-sqlite3',
      database: process.env.DB_DATABASE || ':memory:',
      entities,
      synchronize: true, // 개발용이므로 자동 스키마 동기화
      logging: false,
    };
  }

  // PostgreSQL 설정 (프로덕션 환경)
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'loopa_user',
    password: process.env.DB_PASSWORD || 'loopa_password',
    database: process.env.DB_NAME || 'loopa_db',

    // entities
    entities,

    // 스키마 동기화 비활성화 (수동 마이그레이션 사용)
    synchronize: false,

    // SQL 쿼리 로깅 비활성화
    logging: false,

    // 마이그레이션 자동 실행 비활성화
    migrationsRun: false,

    // 데이터베이스 연결 실패를 무시하고 앱 시작 (개발 중 사용)
    retryAttempts: 1,
    retryDelay: 1000,
  };
};

