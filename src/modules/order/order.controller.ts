import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthenticationGuard } from '../authentication/authentication.guard';
import { RequestWithUser } from '../authentication/types/request-with-user';

@UseGuards(AuthenticationGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async registerOrder(
    @Req() req: RequestWithUser,
    @Body() orderData: CreateOrderDto,
  ) {
    const userId = req.user.sub;
    const orderCreated = await this.orderService.registerOrder(
      userId,
      orderData,
    );
    return orderCreated;
  }

  @Get()
  getOrderByUser(@Req() req: RequestWithUser) {
    const userId = req.user.sub;
    return this.orderService.getOrderByUser(userId);
  }

  @Patch(':id')
  updateOrder(
    @Req() req: RequestWithUser,
    @Param('id') orderId: string,
    @Body() orderAtUpdate: UpdateOrderDto,
  ) {
    const userId = req.user.sub;
    return this.orderService.updateOrder(orderId, orderAtUpdate, userId);
  }
}
