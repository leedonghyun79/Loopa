import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class Product {
  @PrimaryColumn()
  pid!: string;

  @Column()
  name!: string;

  @Column({ type: 'int', default: 0 })
  price!: number;

  @Column({ type: 'int', default: 0 }) // 0: 판매중, 1: 예약중, 2: 거래완료
  status!: number;

  @Column({ default: '' })
  location!: string;

  @Column({ default: '' })
  imageUrl!: string;

  @Column({ type: 'int', default: 0 })
  favoriteCount!: number;

  @Column({ type: 'int', default: 0 })
  chatCount!: number;

  @Column({ nullable: true })
  updatedBefore!: string;

  @Column({ nullable: true })
  createdBefore!: string;

  @Column({ nullable: true })
  sellerUid!: string;

  @Column({ default: false })
  isAd!: boolean;

  @Column({ nullable: true })
  keyword!: string;

  @Column({ nullable: true })
  crawledAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
