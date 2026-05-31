import { Logger } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as sql from 'mssql';

const parseNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const databaseHost = process.env.DB_HOST ?? 'localhost';
const databasePort = parseNumber(process.env.DB_PORT, 1433);
const databaseUsername = process.env.DB_USERNAME ?? 'sa';
const databasePassword = process.env.DB_PASSWORD ?? 'YourStrong!Passw0rd';
const databaseName = process.env.DB_NAME ?? 'tea_leaf_management';
const encrypt = (process.env.DB_ENCRYPT ?? 'false') === 'true';
const trustServerCertificate =
  (process.env.DB_TRUST_SERVER_CERTIFICATE ?? 'true') === 'true';
const synchronize = (process.env.DB_SYNCHRONIZE ?? 'true') === 'true';

const logger = new Logger('DatabaseConfig');

const escapeSqlString = (value: string) => value.replace(/'/g, "''");

const escapeSqlIdentifier = (value: string) => value.replace(/]/g, ']]');

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: databaseHost,
  port: databasePort,
  username: databaseUsername,
  password: databasePassword,
  database: databaseName,
  autoLoadEntities: true,
  synchronize,
  options: {
    encrypt,
    trustServerCertificate,
  },
};

export const ensureDatabaseExists = async () => {
  const databaseLiteral = escapeSqlString(databaseName);
  const databaseIdentifier = escapeSqlIdentifier(databaseName);
  const connection = new sql.ConnectionPool({
    user: databaseUsername,
    password: databasePassword,
    server: databaseHost,
    port: databasePort,
    database: 'master',
    options: {
      encrypt,
      trustServerCertificate,
    },
  });

  try {
    await connection.connect();
    await connection.request().query(`
      IF DB_ID(N'${databaseLiteral}') IS NULL
      BEGIN
        EXEC(N'CREATE DATABASE [${databaseIdentifier}]')
      END
    `);
  } catch (error) {
    logger.error(
      `Unable to ensure database "${databaseName}" exists on ${databaseHost}:${databasePort}.`,
      error instanceof Error ? error.stack : undefined,
    );
    throw error;
  } finally {
    await connection.close();
  }
};
