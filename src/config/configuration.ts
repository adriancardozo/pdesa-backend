import dotenv from 'dotenv';

dotenv.config({});

const configuration = {
  app: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  },
};

export type Configuration = typeof configuration;

export default (): Configuration => configuration;
