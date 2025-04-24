import { Provider, ValidationPipe } from '@nestjs/common';
import { VALIDATION_PIPE } from '../pipe/validation.pipe';

export const VALIDATION_PIPE_PROVIDER: Provider<ValidationPipe> = {
  provide: ValidationPipe,
  useValue: VALIDATION_PIPE,
};
