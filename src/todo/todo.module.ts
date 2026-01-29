import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import DatabaseModule from 'src/database/database.module';
import DatabaseTables from 'src/database/database.tables';
import { InterceptorsModule } from 'src/interceptors/interceptors.module';

@Module({
  imports: [DatabaseModule.forRoot(DatabaseTables.TODO), InterceptorsModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
