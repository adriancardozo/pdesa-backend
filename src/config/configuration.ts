import dotenv from 'dotenv';

dotenv.config({});

const configuration = {
  app: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    version: process.env.SELF_VERSION ?? '-',
  },
  mercado_libre: {
    url: process.env.ML_URL,
    axios_config: {
      headers: {
        authorization: process.env.ML_ACCESS_TOKEN ? `Bearer ${process.env.ML_ACCESS_TOKEN}` : undefined,
      },
    },
  },
};

export type Configuration = typeof configuration;

export default (): Configuration => configuration;
