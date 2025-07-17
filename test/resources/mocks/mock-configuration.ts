const app_name = 'pdesa_backend';

const metrics_labels = ['method', 'path'];

process.env.ML_URL = 'http://localhost:3001';
process.env.ML_ACCESS_TOKEN = 'APP_USR';
process.env.ML_REFRESH_TOKEN = 'TG';

const configuration = {
  app: {
    name: app_name,
    title: 'Backend',
    description: 'Backend API (Prácticas de desarrollo)',
    port: 3000,
    version: '-',
    api_version: '-',
  },
  jwt: { secret: 'SECRET' },
  mercado_libre: {
    app: { client_id: '', client_secret: '' },
    url: 'http://localhost:3001',
    refresh_token: '',
    refresh_config: {
      headers: { accept: 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
    },
    json_path: '',
    axios_config: { headers: { authorization: '' } },
  },
  metrics: {
    app: app_name,
    options: {
      failsCounter: {
        name: `${app_name}_requests_fails_total`,
        help: 'Total number of request fails',
        labelNames: metrics_labels,
      },
      counter: {
        name: `${app_name}_requests_total`,
        help: 'Total number of requests',
        labelNames: metrics_labels,
      },
      gauge: {
        name: `${app_name}_requests_time`,
        help: 'Time of requests',
        labelNames: metrics_labels,
      },
      histogram: {
        name: `${app_name}_requests_time_histogram`,
        help: 'Time of requests histogram',
        labelNames: metrics_labels,
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
      notQueryUser: 'Query user is not setted.',
      purchaseNotFound: 'Purchase not found.',
      reviewNotFound: 'Review not found.',
      firstTimeReview: "First time review must includes both 'rate' and 'comment' fields.",
    },
    regex: { unique: /\bUNIQUE\b/, notFound: /not found/, unauthorized: /unauthorized/ },
  },
};

export type Configuration = typeof configuration;

export default (): Configuration => configuration;
