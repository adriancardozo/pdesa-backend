import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { MercadoLibreModule } from 'src/mercado-libre/mercado-libre.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATA_SOURCE_OPTIONS } from 'src/config/data-source.options';
import { AuthModule } from 'src/auth/auth.module';
import { InitialDataModule } from 'src/initial-data/initial-data.module';
import { FavoriteModule } from 'src/favorite/favorite.module';
import { MetricsModule } from 'src/metrics/metrics.module';
import { PurchaseModule } from 'src/purchase/purchase.module';
import { AdminMetricsModule } from 'src/admin-metrics/admin-metrics.module';
import { AdminUserModule } from 'src/admin-user/admin-user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRoot(DATA_SOURCE_OPTIONS),
    InitialDataModule,
    MercadoLibreModule,
    FavoriteModule,
    AuthModule,
    MetricsModule,
    PurchaseModule,
    AdminMetricsModule,
    AdminUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
