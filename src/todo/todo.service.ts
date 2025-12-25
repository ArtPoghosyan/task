import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import DatabaseModule from '../database/database.module';
const Todo = new DatabaseModule('Todo');

@Injectable()
export class TodoService {
  async create(createTodoDto: CreateTodoDto) {
    try {
      return await Todo.create({ id: Date.now(), ...createTodoDto });
    } catch (err: any) {
      console.log('Error in create router service', err);
      return { message: 'error' };
    }
  }

  async findAll() {
    try {
      return await Todo.find();
    } catch (err) {
      console.log('Error in findAll router service', err);
      return { message: 'error' };
    }
  }

  async findOne(id: string) {
    try {
      return await Todo.find({ id: +id });
    } catch (err) {
      console.log('Error in findOne router service', err);
      return { message: 'error' };
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    try {
      return await Todo.update({ id: +id }, { $set: { ...updateTodoDto } });
    } catch (err) {
      console.log('Error in update router service', err);
      return { message: 'error' };
    }
  }

  async remove(id: string) {
    try {
      return await Todo.remove({ id: +id });
    } catch (err) {
      console.log('Error in remove router service', err);
      return { message: 'error' };
    }
  }
}
