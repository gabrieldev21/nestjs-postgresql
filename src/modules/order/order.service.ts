/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  private async findUser(id: string) {
    const receivedUser = await this.userRepository.findOneBy({ id });

    if (!receivedUser) {
      throw new NotFoundException('User not found');
    }
    return receivedUser;
  }

  private handlingOrderData(
    orderData: CreateOrderDto,
    relatedProducts: ProductEntity[],
  ): void {
    const relatedProductMap = new Map(
      relatedProducts.map(product => [product.id, product]),
    );
    orderData.orderItems.forEach(orderItem => {
      const relatedProduct = relatedProductMap.get(orderItem.productId);

      if (!relatedProduct) {
        throw new NotFoundException(
          `Product id ${orderItem.productId} not found`,
        );
      }

      if (orderItem.quantity > relatedProduct.availableQuantity) {
        throw new BadRequestException(
          `Order item quantity (${orderItem.quantity}) is greater than product quantity available (${relatedProduct.availableQuantity}) for ${relatedProduct.name}`,
        );
      }
    });
  }

  async registerOrder(userId: string, orderData: CreateOrderDto) {
    const receivedUser = await this.findUser(userId);
    const productIds = orderData.orderItems.map(
      orderItem => orderItem.productId,
    );
    const relatedProducts = await this.productRepository.findBy({
      id: In(productIds),
    });

    this.handlingOrderData(orderData, relatedProducts);

    const orderEntity = new OrderEntity();
    orderEntity.status = StatusOrder.IN_PROCESSING;
    orderEntity.user = receivedUser;

    const orderItemsEntity = orderData.orderItems.map(orderItem => {
      const relatedProduct = relatedProducts.find(
        product => product.id === orderItem.productId,
      );

      const orderItemEntity = new OrderItemEntity();
      orderItemEntity.product = relatedProduct!;
      orderItemEntity.sellPrice = relatedProduct!.price;
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

    if (!savedOrder) {
      throw new NotFoundException('Order not found');
    }

    Object.assign(savedOrder, orderDto);

    return this.orderRepository.save(savedOrder);
  }
}
