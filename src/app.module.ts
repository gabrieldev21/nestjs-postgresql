import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { PostgresConfigService } from './config/postgres.config.service';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { ExceptionFilterGlobal } from './utils/exception/exception-filter-global';

@Module({
  imports: [
    UserModule,
    ProductModule,
    OrderModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilterGlobal,
    },
  ],
})
export class AppModule {}
