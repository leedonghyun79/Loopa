import { Controller, Get, Post, Body, Param, Query, Delete, ParseArrayPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('bulk')
  async bulkUpsert(@Body(new ParseArrayPipe({ items: CreateProductDto })) dtos: CreateProductDto[]) {
    return this.productsService.bulkUpsert(dtos);
  }

  @Get()
  async findAll(@Query('keyword') keyword?: string) {
    return this.productsService.findAll(keyword);
  }

  @Get(':pid')
  async findOne(@Param('pid') pid: string) {
    return this.productsService.findOne(pid);
  }

  @Delete()
  async removeAll() {
    return this.productsService.removeAll();
  }
}
