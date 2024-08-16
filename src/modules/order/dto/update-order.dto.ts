import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';

import { CreateOrderDto } from './create-order.dto';
import { StatusOrder } from '../entities/status-pedido.enum';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsEnum(StatusOrder)
  status: StatusOrder;
}
