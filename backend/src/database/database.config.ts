import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const parseNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseNumber(process.env.DB_PORT, 1433),
  username: process.env.DB_USERNAME ?? 'sa',
  password: process.env.DB_PASSWORD ?? 'YourStrong!Passw0rd',
  database: process.env.DB_NAME ?? 'tea_leaf_management',
  autoLoadEntities: true,
  synchronize: false,
  options: {
    encrypt: (process.env.DB_ENCRYPT ?? 'false') === 'true',
    trustServerCertificate:
      (process.env.DB_TRUST_SERVER_CERTIFICATE ?? 'true') === 'true',
  },
};
