import { Injectable, Paramtype, Type, ValidationPipe } from '@nestjs/common';

@Injectable()
export class ValidationService {
  constructor(private readonly validationPipe: ValidationPipe) {}

  async transform<T>(value: any, metatype: Type<T>, type: Paramtype = 'custom', data?: string): Promise<T> {
    return (await this.validationPipe.transform(value, { type, metatype, data })) as T;
  }
}
