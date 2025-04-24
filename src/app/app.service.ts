import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private version_string: string;

  constructor(private readonly configService: ConfigService) {
    this.version_string = this.configService.get<string>('app.version')!;
  }

  version(): string {
    return this.version_string;
  }
}
