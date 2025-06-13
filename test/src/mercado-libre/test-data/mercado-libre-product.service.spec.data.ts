import { AxiosResponse } from 'axios';
import realConfiguration from 'src/config/configuration';

export const query = 'product-query';

export const url = 'https://api.mercadolibre.com';

export const config = { headers: { authorization: 'Bearer token' } };

export const errors = {
  mlServiceUnavailable: 'MercadoLibre service is not available',
  mlProductNotFound: 'MercadoLibre product not found.',
};

export const regexes = realConfiguration().error.regex;

export const configuration = () => ({
  mercado_libre: { url, axios_config: config },
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
