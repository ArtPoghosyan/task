import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { DataBase } from './db/database';
import { TODO } from '../typescript/todo/todo.interfaces';

@Injectable()
export class TodoService {
  async create(createTodoDto: CreateTodoDto) {
    const todoObj: TODO = { id: Date.now(), ...createTodoDto };
    return (await DataBase.create(todoObj)) || { message: 'failed' };
  }

  findAll() {
    return DataBase.find() || { message: 'failed' };
  }

  findOne(id: string) {
    return DataBase.find(id) || { message: 'failed' };
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    return (await DataBase.update(id, updateTodoDto)) || { message: 'failed' };
  }

  async remove(id: string) {
    return (await DataBase.remove(id)) || { message: 'failed' };
  }
}
