import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, Observable } from 'rxjs';
import { Configuration } from 'src/config/configuration';
import { MercadoLibreSearchResult } from './entity/mercado-libre-search-result.entity';
import { ValidationService } from 'src/validation/validation.service';

@Injectable()
export class MercadoLibreProductService {
  private readonly url: Configuration['mercado_libre']['url'];
  private readonly config: Configuration['mercado_libre']['axios_config'];
  private readonly errors: Configuration['error']['message'];

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly validationService: ValidationService,
  ) {
    this.url = `${this.configService.get('mercado_libre.url')!}/products`;
    this.config = this.configService.get('mercado_libre.axios_config')!;
    this.errors = this.configService.get('error.message')!;
  }

  async search(q: string) {
    const url = `${this.url}/search?status=active&site_id=MLA&q=${q}`;
    const { data } = await this.run(() => this.httpService.get(url, this.config));
    return await this.validationService.transform(data, MercadoLibreSearchResult);
  }

  private async run<T>(request: () => Observable<T>, errorFactory?: (error) => HttpException): Promise<T> {
    try {
      return await firstValueFrom(request());
    } catch (error) {
      const exception = errorFactory
        ? errorFactory(error)
        : new ServiceUnavailableException(this.errors.mlServiceUnavailable);
      throw exception;
    }
  }
}
