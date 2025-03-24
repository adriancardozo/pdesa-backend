import { ConfigService } from '@nestjs/config';
import configuration from 'src/config/configuration';

export const CONFIG_SERVICE = new ConfigService(configuration());
