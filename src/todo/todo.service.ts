import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import DatabaseService from 'src/database/database.service';
import DatabaseTables from 'src/database/database.tables';

@Injectable()
export class TodoService {
  constructor(
    @Inject(DatabaseTables.TODO) private readonly todoTable: DatabaseService,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    const todo = await this.todoTable.create({
      id: Date.now(),
      ...createTodoDto,
    });
    return { message: 'success', todo };
  }

  async getAll() {
    return await this.todoTable.find();
  }

  async getOne(id: number) {
    const todo = await this.todoTable.find(id);
    if (!todo) throw new NotFoundException();
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const updateQuery = await this.todoTable.update(id, updateTodoDto);
    if (!updateQuery)
      throw new NotFoundException({
        message: 'Not Found For Update',
        statusCode: 404,
      });
    return { message: 'success' };
  }

  async remove(id: number) {
    const removeQuery = await this.todoTable.remove(id);
    if (!removeQuery)
      throw new NotFoundException({
        message: 'Not Found For Delete',
        statusCode: 404,
      });
    return { message: 'success' };
  }
}
