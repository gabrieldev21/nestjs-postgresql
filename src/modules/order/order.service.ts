import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ProductEntity } from '../product/entities/product.entity';
import { UserEntity } from '../user/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { StatusOrder } from './entities/status-pedido.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async registerOrder(userId: string, orderData: CreateOrderDto) {
    const receivedUser = await this.userRepository.findOneBy({ id: userId });
    const productIds = orderData.orderItems.map(
      orderItem => orderItem.productId,
    );

    const relatedProducts = await this.productRepository.findBy({
      id: In(productIds),
    });
    const orderEntity = new OrderEntity();

    orderEntity.status = StatusOrder.IN_PROCESSING;
    orderEntity.user = receivedUser;

    const orderItemsEntity = orderData.orderItems.map(orderItem => {
      const relatedProduct = relatedProducts.find(
        product => product.id === orderItem.productId,
      );
      const orderItemEntity = new OrderItemEntity();

      orderItemEntity.product = relatedProduct;
      orderItemEntity.sellPrice = relatedProduct.price;
      orderItemEntity.quantity = orderItem.quantity;
      orderItemEntity.product.availableQuantity -= orderItem.quantity;

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
