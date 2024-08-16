import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
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
