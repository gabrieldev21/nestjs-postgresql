import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async registerOrder(
    @Query('userId') userId: string,
    @Body() orderData: CreateOrderDto,
  ) {
    const orderCreated = await this.orderService.registerOrder(
      userId,
      orderData,
    );
    return orderCreated;
  }

  @Get()
  getOrderByUser(@Query('userId') userId: string) {
    return this.orderService.getOrderByUser(userId);
  }

  @Patch(':id')
  updateOrder(
    @Param('id') orderId: string,
    @Body() orderAtUpdate: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(orderId, orderAtUpdate);
  }
}
