import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async bulkUpsert(dtos: CreateProductDto[]) {
    const products = dtos.map((dto) => {
      const p = new Product();
      p.pid = dto.pid;
      p.name = dto.name;
      p.price = dto.price;
      p.status = dto.status;
      p.location = dto.location || '';
      p.imageUrl = dto.image_url || '';
      p.favoriteCount = dto.favorite_count || 0;
      p.chatCount = dto.chat_count || 0;
      p.updatedBefore = dto.updated_before || '';
      p.createdBefore = dto.created_before || '';
      p.sellerUid = dto.seller_uid || '';
      p.isAd = dto.is_ad || false;
      p.keyword = dto.keyword || '';
      p.crawledAt = dto.crawled_at ? new Date(dto.crawled_at) : new Date();
      return p;
    });

    // Chunk size to prevent too many SQLite parameters if list is huge
    const chunkSize = 100;
    
    for (let i = 0; i < products.length; i += chunkSize) {
      const chunk = products.slice(i, i + chunkSize);
      
      // Perform upsert (using simple columns array for database compatibility)
      await this.productRepository.upsert(chunk, ['pid']);
    }

    return {
      success: true,
      count: products.length,
    };
  }

  async findAll(keyword?: string) {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    
    if (keyword) {
      queryBuilder.where('product.keyword = :keyword OR product.name LIKE :likeKeyword', {
        keyword,
        likeKeyword: `%${keyword}%`,
      });
    }

    // Bunjang 고유 ID(pid) 기준으로 역순 정렬하면 수집 시점과 상관없이
    // 실제 번개장터에 등록된 최신 순서로 다양한 카테고리의 상품이 자연스럽게 섞여 나옵니다.
    queryBuilder.orderBy('product.pid', 'DESC');
    
    return queryBuilder.getMany();
  }

  async findOne(pid: string) {
    return this.productRepository.findOneBy({ pid });
  }

  async removeAll() {
    await this.productRepository.clear();
    return { success: true };
  }
}
