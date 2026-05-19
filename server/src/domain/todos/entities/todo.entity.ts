import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn()
  id!:number;

  @Index()
  @Column()
  todo!: string;

  @Column({default: false})
  isCompleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}