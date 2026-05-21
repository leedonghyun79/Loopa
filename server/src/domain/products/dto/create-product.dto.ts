import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  pid!: string;

  @IsString()
  name!: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  status!: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsNumber()
  favorite_count?: number;

  @IsOptional()
  @IsNumber()
  chat_count?: number;

  @IsOptional()
  @IsString()
  updated_before?: string;

  @IsOptional()
  @IsString()
  created_before?: string;

  @IsOptional()
  @IsString()
  seller_uid?: string;

  @IsOptional()
  @IsBoolean()
  is_ad?: boolean;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  crawled_at?: string;
}
