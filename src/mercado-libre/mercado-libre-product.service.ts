import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Configuration } from 'src/config/configuration';
import { VALIDATION_PIPE } from 'src/shared/validation/validation.pipe';
import { MercadoLibreSearchResult } from './entity/mercado-libre-search-result.entity';

@Injectable()
export class MercadoLibreProductService {
  private readonly url: Configuration['mercado_libre']['url'];
  private readonly config: Configuration['mercado_libre']['axios_config'];

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.url = `${this.configService.get('mercado_libre.url')!}/products`;
    this.config = this.configService.get('mercado_libre.axios_config')!;
  }

  async search(q: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.url}/search?status=active&site_id=MLA&q=${q}`, this.config),
    );
    // return data;
    return await VALIDATION_PIPE.transform(data, { type: 'custom', metatype: MercadoLibreSearchResult });
  }
}
