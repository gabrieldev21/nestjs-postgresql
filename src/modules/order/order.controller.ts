import { Controller, Get, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  registerOrder(@Query('userId') userId: string) {
    return this.orderService.registerOrder(userId);
  }

  @Get()
  getOrderByUser(@Query('userId') userId: string) {
    return this.orderService.getOrderByUser(userId);
  }
}
