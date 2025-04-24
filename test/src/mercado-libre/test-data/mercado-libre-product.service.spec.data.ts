import { AxiosResponse } from 'axios';

export const query = 'product-query';

export const url = 'https://api.mercadolibre.com';

export const config = { headers: { authorization: 'Bearer token' } };

export const errors = { mlServiceUnavailable: 'MercadoLibre service is not available' };

export const configuration = () => ({
  mercado_libre: { url, axios_config: config },
  error: { message: errors },
});

export function searchUrl(query: string) {
  return `${url}/products/search?status=active&site_id=MLA&q=${query}`;
}

export const searchResult = {} as AxiosResponse;
