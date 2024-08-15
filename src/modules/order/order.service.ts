import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderEntity } from './entities/order.entity';
import { UserEntity } from '../user/entities/user.entity';
import { StatusOrder } from './entities/status-pedido.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async registerOrder(userId: string) {
    const receivedUser = await this.userRepository.findOneBy({ id: userId });
    const orderEntity = new OrderEntity();

    orderEntity.totalValue = 0;
    orderEntity.status = StatusOrder.IN_PROCESSING;
    orderEntity.user = receivedUser;

    const orderCreated = await this.orderRepository.save(orderEntity);
    return orderCreated;
  }

  async getOrderByUser(userId: string) {
    const orderCreated = await this.orderRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });
    return orderCreated;
  }
}
