import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {

  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}


  create(createTodoDto: CreateTodoDto) {
    const todo = this.todoRepository.create({...createTodoDto});
    return this.todoRepository.save(todo);
  }

  findAll() {
    return this.todoRepository.find();
  }

  findOne(id: number) {
    return this.todoRepository.findOneBy({ id });
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return this.todoRepository.update(id, {...updateTodoDto}); 
  }

  remove(id: number) {
    return this.todoRepository.delete(id);
  }
}
