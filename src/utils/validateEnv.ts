import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({ default: 'development' }),
    PORT: port({ default: 3000 }),
    DATABASE_URL: str(),
  });
};

export default validateEnv;
