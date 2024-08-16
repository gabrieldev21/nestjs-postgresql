import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderEntity } from './entities/order.entity';
import { UserEntity } from '../user/entities/user.entity';
import { StatusOrder } from './entities/status-pedido.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemEntity } from './entities/order-item.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async registerOrder(userId: string, orderData: CreateOrderDto) {
    const receivedUser = await this.userRepository.findOneBy({ id: userId });
    const orderEntity = new OrderEntity();

    orderEntity.status = StatusOrder.IN_PROCESSING;
    orderEntity.user = receivedUser;

    const orderItemsEntity = orderData.orderItems.map(orderItem => {
      const orderItemEntity = new OrderItemEntity();

      orderItemEntity.sellPrice = 10;
      orderItemEntity.quantity = orderItem.quantity;
      return orderItemEntity;
    });

    const totalValue = orderItemsEntity.reduce((total, item) => {
      return total + item.sellPrice * item.quantity;
    }, 0);

    orderEntity.orderItems = orderItemsEntity;

    orderEntity.totalValue = totalValue;

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

  async updateOrder(id: string, orderDto: UpdateOrderDto) {
    const savedOrder = await this.orderRepository.findOneBy({ id });

    Object.assign(savedOrder, orderDto);

    return this.orderRepository.save(savedOrder);
  }
}
