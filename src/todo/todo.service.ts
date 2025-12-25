import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import DatabaseModule from '../database/database.module';

@Injectable()
export class TodoService {
  private Todo: DatabaseModule = new DatabaseModule('Todo');

  async create(createTodoDto: CreateTodoDto) {
    try {
      return await this.Todo.create({ id: Date.now(), ...createTodoDto });
    } catch (err: any) {
      console.log('Error in create router service', err);
      return { message: 'error' };
    }
  }

  async findAll() {
    try {
      return await this.Todo.find();
    } catch (err) {
      console.log('Error in findAll router service', err);
      return { message: 'error' };
    }
  }

  async findOne(id: string) {
    try {
      const todo = await this.Todo.find({ id: +id });
      return todo ? todo : { message: 'not found' };
    } catch (err) {
      console.log('Error in findOne router service', err);
      return { message: 'error' };
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    try {
      return (
        (await this.Todo.update(
          { id: +id },
          { $set: { ...updateTodoDto } },
        )) && { message: 'success' }
      );
    } catch (err) {
      console.log('Error in update router service', err);
      return { message: 'error' };
    }
  }

  async remove(id: string) {
    try {
      return (await this.Todo.remove({ id: +id })) && { message: 'success' };
    } catch (err) {
      console.log('Error in remove router service', err);
      return { message: 'error' };
    }
  }
}
