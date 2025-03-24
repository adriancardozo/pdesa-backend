import dotenv from 'dotenv';

dotenv.config({});

const configuration = {
  app: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    version: process.env.SELF_VERSION ?? '-',
  },
};

export type Configuration = typeof configuration;

export default (): Configuration => configuration;
