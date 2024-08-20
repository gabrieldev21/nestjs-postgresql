import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ListProductDto } from './dto/list-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  private listProductDto(product: ProductEntity) {
    const listProduct = new ListProductDto(
      product.id,
      product.name,
      product.features,
      product.images,
    );

    return listProduct;
  }

  async createProduct(productData: CreateProductDto) {
    const product = new ProductEntity();

    Object.assign(product, productData as ProductEntity);

    await this.productRepository.save(product);
  }

  async listProducts() {
    const savedProducts = await this.productRepository.find({
      relations: {
        images: true,
        features: true,
      },
    });

    const productList = savedProducts.map(product =>
      this.listProductDto(product),
    );
    return productList;
  }

  async listById(id: string) {
    const savedProduct = await this.productRepository.findOne({
      where: { id },
      relations: {
        images: true,
        features: true,
      },
    });

    if (!savedProduct) {
      throw new NotFoundException(`Product id ${id} not found`);
    }
    return this.listProductDto(savedProduct);
  }

  async updateProduct(id: string, newData: UpdateProductDto) {
    const existingProduct = await this.productRepository.findOneBy({ id });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    Object.assign(existingProduct, newData as ProductEntity);

    await this.productRepository.save(existingProduct);
  }

  async deleteProduct(id: string) {
    const deleteResult = await this.productRepository.delete(id);

    if (!deleteResult.affected) {
      throw new Error('Product not found');
    }
    return deleteResult;
  }
}
