import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { MercadoLibreModule } from 'src/mercado-libre/mercado-libre.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATA_SOURCE_OPTIONS } from 'src/config/data-sorce.options';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRoot(DATA_SOURCE_OPTIONS),
    MercadoLibreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
