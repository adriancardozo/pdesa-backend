import { Module } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { VALIDATION_PIPE_PROVIDER } from './provider/validation.provider';

@Module({
  providers: [ValidationService, VALIDATION_PIPE_PROVIDER],
  exports: [ValidationService],
})
export class ValidationModule {}
