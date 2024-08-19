import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  quantity: number;
}

export class CreateOrderDto {
  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}
