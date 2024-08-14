import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/product-feature.dto';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createNew(@Body() productData: CreateProductDto) {
    const product = new ProductEntity();

    product.id = randomUUID();
    product.name = productData.name;
    product.userId = productData.userId;
    product.price = productData.price;
    product.quantity = productData.quantity;
    product.description = productData.description;
    product.category = productData.category;
    product.features = productData.features;
    product.images = productData.images;

    const registeredProduct = this.productService.createProduct(product);
    return registeredProduct;
  }

  @Get()
  async listAll() {
    return this.productService.listProducts();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() productData: UpdateProductDto) {
    const updatedProduct = await this.productService.updateProduct(
      id,
      productData,
    );

    return {
      message: 'Product successfully updated',
      product: updatedProduct,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const removedProduct = await this.productService.deleteProduct(id);

    return {
      message: 'Product successfully removed',
      product: removedProduct,
    };
  }
}
