import dotenv from 'dotenv';
import { version } from 'src/../package.json';

dotenv.config({});

const configuration = {
  app: {
    title: 'Backend',
    description: 'Backend API (Prácticas de desarrollo)',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    version: process.env.SELF_VERSION ?? '-',
    api_version: process.env.SELF_VERSION ?? version,
  },
  jwt: { secret: process.env.JWT_SECRET! },
  database: {
    host: process.env.MSSQL_HOST,
    port: parseInt(process.env.MSSQL_PORT ?? '1433', 10),
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
      onCreateUser: 'Error on create user.',
      userAlreadyExists: 'User already exists.',
      userNotFound: 'User not found.',
      mlProductNotFound: 'MercadoLibre product not found.',
      favoriteNotFound: 'Favorite not found.',
    },
    regex: { unique: /\bUNIQUE\b/, notFound: /not found/ },
  },
};

export type Configuration = typeof configuration;

export default (): Configuration => configuration;
