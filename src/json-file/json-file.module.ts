import { Module } from '@nestjs/common';
import { JSONFileService } from './json-file.service';

@Module({
  providers: [JSONFileService],
  exports: [JSONFileService],
})
export class JSONFileModule {}
