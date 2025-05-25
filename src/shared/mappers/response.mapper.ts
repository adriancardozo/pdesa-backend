import { Response } from 'src/shared/responses/response';
import { ModelEntity } from '../entity/model-entity';

export type Class<T> = { new (...args: any[]): T };

export class ResponseMapper {
  map<T extends ModelEntity, R extends Response<T>, S extends Class<R>>(source: T, ResponseClass: S): R;
  map<T extends ModelEntity, R extends Response<T>, S extends Class<R>>(
    source: Array<T>,
    ResponseClass: S,
  ): Array<R>;
  map<T extends ModelEntity, R extends Response<T>, S extends Class<R>>(
    source: T | Array<T>,
    ResponseClass: S,
  ): R | Array<R>;
  map<T extends ModelEntity, R extends Response<T>, S extends Class<R>>(
    source: T | Array<T>,
    ResponseClass: S,
  ): R | Array<R> {
    if (source instanceof Array) {
      return this.mapArray(source, ResponseClass);
    } else {
      return new ResponseClass(source, this);
    }
  }

  private mapArray<T extends ModelEntity, R extends Response<T>, S extends Class<R>>(
    sources: Array<T>,
    ResponseClass: S,
  ): Array<R> {
    return sources.map((source) => this.map(source, ResponseClass));
  }
}
