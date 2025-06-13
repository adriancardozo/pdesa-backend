import { AxiosError, AxiosResponse } from 'axios';
import realConfiguration from 'src/config/configuration';
import { RefreshTokenResult } from 'src/mercado-libre/entity/refresh-token-result.entity';

export const query = 'product-query';

export const url = 'https://api.mercadolibre.com';

export const config = { headers: { authorization: 'Bearer token' } };

export const app = { client_id: 'client_id', client_secret: 'client_secret' };

export const refresh_token = 'refresh_token';

export const refresh_config = {
  headers: { accept: 'application/json', 'content-type': 'application/x-www-form-urlencoded' },
};

export const errors = {
  mlServiceUnavailable: 'MercadoLibre service is not available',
  mlProductNotFound: 'MercadoLibre product not found.',
};

export const regexes = realConfiguration().error.regex;

export const configuration = () => ({
  mercado_libre: { url, axios_config: config, app, refresh_config, refresh_token },
  error: { message: errors, regex: regexes },
});

export function searchUrl(query: string) {
  return `${url}/products/search?status=active&site_id=MLA&q=${query}`;
}

export function getProductUrl(idMl: string) {
  return `${url}/products/${idMl}`;
}

export const searchResult = {} as AxiosResponse;

export const getProductResult = {} as AxiosResponse;

export const idMl = 'ML1111111';

export const mlNotFoundError = { response: { data: { error: 'resource not found' } } };

export const unauthorizedError = { response: { data: { code: 'unauthorized' } } } as AxiosError;

export const refreshTokenUrl = `${url}/oauth/token`;

export const refreshTokenBody = { grant_type: 'refresh_token', ...app, refresh_token };

export const refreshTokenConfig = refresh_config;

export const refreshTokenResult = {
  refresh_token: 'refresh_token',
  access_token: 'access_token',
  bearer: 'Bearer access_token',
} as RefreshTokenResult;
