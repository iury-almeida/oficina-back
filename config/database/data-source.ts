import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'database_name',
  timezone: 'America/Sao_Paulo',
  synchronize: false,
  migrationsRun: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [path.join(__dirname, "../../src/entity/**/*.{js,ts}")],
  migrations: [path.join(__dirname, '../../src/migration/**/*.{js,ts}')],
  subscribers: [path.join(__dirname, '../../src/subscriber/**/*.{js,ts}')],
});
