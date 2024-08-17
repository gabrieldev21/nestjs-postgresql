import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderEntity } from './entities/order.entity';
import { ProductEntity } from '../product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, UserEntity, ProductEntity])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
