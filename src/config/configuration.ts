import dotenv from 'dotenv';

dotenv.config({});

const configuration = {
  app: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    version: process.env.SELF_VERSION ?? '-',
  },
  database: {
    host: process.env.MSSQL_HOST,
    port: parseInt(process.env.MSSQL_PORT || '1433', 10),
    username: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    database: process.env.MSSQL_DB,
    synchronize: process.env.MSSQL_SYNCHRONIZE === 'true',
    logging: process.env.MSSQL_LOGGING === 'true',
    options: {
      encrypt: process.env.MSSQL_ENCRYPT === 'true',
      trustServerCertificate: process.env.MSSQL_TRUST_CERT === 'true',
    },
  },
  mercado_libre: {
    url: process.env.ML_URL,
    axios_config: {
      headers: {
        authorization: process.env.ML_ACCESS_TOKEN ? `Bearer ${process.env.ML_ACCESS_TOKEN}` : undefined,
      },
    },
  },
  error: {
    message: {
      mlServiceUnavailable: 'MercadoLibre Service is not available',
      mlProductInactive: 'Product not exists or is inactive.',
    },
  },
};

export type Configuration = typeof configuration;

export default (): Configuration => configuration;
