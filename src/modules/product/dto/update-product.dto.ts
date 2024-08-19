import { PartialType } from '@nestjs/mapped-types';

import { ProductFeatureDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(ProductFeatureDto) {}
