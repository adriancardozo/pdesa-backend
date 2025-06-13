import type { ResponseMapper } from 'src/shared/mappers/response.mapper';
import { ModelEntity } from '../entity/model-entity';

export abstract class Response<T extends ModelEntity> {
  constructor(source: T, mapper: ResponseMapper) {}
}
