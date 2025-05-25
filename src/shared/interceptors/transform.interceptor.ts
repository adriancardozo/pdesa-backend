import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'src/shared/responses/response';
import { ResponseMapper } from '../mappers/response.mapper';
import { ModelEntity } from '../entity/model-entity';

export class TransformInterceptor<T extends ModelEntity>
  implements NestInterceptor<T | T[], Response<T> | Response<T>[]>
{
  private mapper: ResponseMapper = new ResponseMapper();

  constructor(private ResponseClass: typeof Response<T>) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>>;
  intercept(context: ExecutionContext, next: CallHandler<T[]>): Observable<Response<T>[]>;
  intercept(
    context: ExecutionContext,
    next: CallHandler<T | T[]>,
  ): Observable<Response<T> | Response<T>[]> {
    return next
      .handle()
      .pipe<Response<T> | Response<T>[]>(map((data) => this.mapper.map(data, this.ResponseClass)));
  }
}
