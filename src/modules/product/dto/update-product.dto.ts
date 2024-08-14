import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

import { ProductFeatureDto, ProductImageDto } from './create-product.dto';

export class UpdateProductDto {
  @IsUUID(undefined, { message: 'Invalid user ID' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Product name cannot be empty' })
  @IsOptional()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'Price must be greater than zero' })
  @IsOptional()
  price: number;

  @IsNumber()
  @Min(0, { message: 'Invalid minimum quantity' })
  @IsOptional()
  quantity: number;

  @IsString()
  @IsOptional()
  description: string;

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ProductFeatureDto)
  @IsOptional()
  characteristics: ProductFeatureDto[];

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ProductImageDto)
  @IsOptional()
  images: ProductImageDto[];

  @IsString()
  @IsNotEmpty({ message: 'Product category cannot be empty' })
  @IsOptional()
  category: string;
}
