import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { ProductEntity } from '../entities/product.entity';

export class ProductFeatureDto {
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'Feature name cannot be empty' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Feature description cannot be empty' })
  description: string;

  product: ProductEntity;
}

export class ProductImageDto {
  id: string;

  @IsUrl()
  url: string;

  @IsString()
  @IsNotEmpty({ message: 'Image description cannot be empty' })
  description: string;

  product: ProductEntity;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name cannot be empty' })
  name: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'Price must be greater than zero' })
  price: number;

  @IsNumber()
  @Min(0, { message: 'Invalid minimum quantity' })
  availableQuantity: number;

  @IsString()
  @IsNotEmpty({ message: 'Product description cannot be empty' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description: string;

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ProductFeatureDto)
  features: ProductFeatureDto[];

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  @IsString()
  @IsNotEmpty({ message: 'Product category cannot be empty' })
  category: string;
}
