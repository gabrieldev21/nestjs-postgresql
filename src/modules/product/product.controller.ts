import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createNew(@Body() productData: CreateProductDto) {
    const registeredProduct = this.productService.createProduct(productData);
    return registeredProduct;
  }

  @Get()
  async listAll() {
    return this.productService.listProducts();
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  async listById(@Param('id') id: string) {
    return await this.productService.listById(id);
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
