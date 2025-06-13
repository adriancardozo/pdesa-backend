import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, Observable } from 'rxjs';
import { Configuration } from 'src/config/configuration';
import { MercadoLibreSearchResult } from './entity/mercado-libre-search-result.entity';
import { ValidationService } from 'src/validation/validation.service';
import { MercadoLibreProduct } from './entity/mercado-libre-product.entity';

export type MercadoLibreServiceErrorFactory = (error, defaultFactory: () => HttpException) => HttpException;

@Injectable()
export class MercadoLibreProductService {
  private readonly url: Configuration['mercado_libre']['url'];
  private readonly config: Configuration['mercado_libre']['axios_config'];
  private readonly errors: Configuration['error']['message'];
  private readonly errorRegexes: Configuration['error']['regex'];

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly validationService: ValidationService,
  ) {
    this.url = `${this.configService.get('mercado_libre.url')!}/products`;
    this.config = this.configService.get('mercado_libre.axios_config')!;
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
  ): Promise<T> {
    try {
      return await firstValueFrom(request());
    } catch (error) {
      const defaultFactory = () => new ServiceUnavailableException(this.errors.mlServiceUnavailable);
      const exception = errorFactory ? errorFactory(error, defaultFactory) : defaultFactory();
      throw exception;
    }
  }
}
