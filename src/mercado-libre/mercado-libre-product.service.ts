import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, Observable } from 'rxjs';
import { Configuration } from 'src/config/configuration';
import { MercadoLibreSearchResult } from './entity/mercado-libre-search-result.entity';
import { ValidationService } from 'src/validation/validation.service';
import { MercadoLibreProduct } from './entity/mercado-libre-product.entity';
import { JSONFileService } from 'src/json-file/json-file.service';
import { MercadoLibreTokenJSON } from 'src/config/ml-access-token';
import { RefreshTokenResult } from './entity/refresh-token-result.entity';
import { CONFIG_SERVICE } from 'src/shared/config/config.service';

export type MercadoLibreServiceErrorFactory = (error, defaultFactory: () => HttpException) => HttpException;

@Injectable()
export class MercadoLibreProductService {
  private url: string;
  private mercadoLibre: Configuration['mercado_libre'];
  private config: Configuration['mercado_libre']['axios_config'];
  private readonly errors: Configuration['error']['message'];
  private readonly errorRegexes: Configuration['error']['regex'];

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly validationService: ValidationService,
    private readonly jsonFileService: JSONFileService,
  ) {
    this.setMercadoLibre();
    this.errors = this.configService.get('error.message')!;
    this.errorRegexes = this.configService.get('error.regex')!;
  }

  async search(q: string) {
    const url = `${this.url}/search?status=active&site_id=MLA&q=${q}`;
    const { data } = await this.run(() => this.httpService.get(url, this.config));
    return await this.validationService.transform(data, MercadoLibreSearchResult, 'body');
  }

  async getProduct(idMl: string): Promise<MercadoLibreProduct> {
    const url = `${this.url}/${idMl}`;
    const errorFactory: MercadoLibreServiceErrorFactory = (error, defaultFactory) =>
      this.errorRegexes.notFound.test(error?.response?.data?.error)
        ? new NotFoundException(this.errors.mlProductNotFound)
        : defaultFactory();
    const { data } = await this.run(() => this.httpService.get(url, this.config), errorFactory);
    return await this.validationService.transform(data, MercadoLibreProduct, 'body');
  }

  private async run<T>(
    request: () => Observable<T>,
    errorFactory?: MercadoLibreServiceErrorFactory,
    refresh: boolean = true,
  ): Promise<T> {
    try {
      return refresh ? await this.runWithUpdatedToken(request) : await firstValueFrom(request());
    } catch (error) {
      const defaultFactory = () => new ServiceUnavailableException(this.errors.mlServiceUnavailable);
      const exception = errorFactory ? errorFactory(error, defaultFactory) : defaultFactory();
      throw exception;
    }
  }

  private async runWithUpdatedToken<T>(request: () => Observable<T>): Promise<T> {
    try {
      return await firstValueFrom(request());
    } catch (error) {
      if (this.errorRegexes.unauthorized.test(error?.response?.data?.code)) {
        this.updateToken(await this.refreshToken());
        return await firstValueFrom(request());
      }
      throw error;
    }
  }

  private async refreshToken(): Promise<RefreshTokenResult> {
    const url = `${this.mercadoLibre.url}/oauth/token`;
    const grant_type = 'refresh_token';
    const body = { grant_type, ...this.mercadoLibre.app, refresh_token: this.mercadoLibre.refresh_token };
    const config = this.mercadoLibre.refresh_config;
    const { data } = await this.run(() => this.httpService.post(url, body, config), undefined, false);
    const result = await this.validationService.transform(data, RefreshTokenResult, 'body');
    return result;
  }

  private updateToken({ bearer, token, refresh }: RefreshTokenResult): void {
    this.jsonFileService.write<MercadoLibreTokenJSON>(this.mercadoLibre.json_path, { token, refresh });
    CONFIG_SERVICE.set('mercado_libre.refresh_token', refresh);
    CONFIG_SERVICE.set('mercado_libre.axios_config.headers.authorization', bearer);
    this.setMercadoLibre();
  }

  private setMercadoLibre() {
    this.mercadoLibre = this.configService.get<Configuration['mercado_libre']>('mercado_libre')!;
    this.url = `${this.mercadoLibre.url}/products`;
    this.config = this.mercadoLibre.axios_config;
  }
}
