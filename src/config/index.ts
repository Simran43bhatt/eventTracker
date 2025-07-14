import dotenv from 'dotenv';

dotenv.config();

export const CREDENTIALS = process.env.CREDENTIALS === 'true';

export const {
  NODE_ENV,
  PORT,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  DATABASE_URL,
} = process.env;
