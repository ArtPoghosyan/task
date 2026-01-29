import { DynamicModule, Module } from '@nestjs/common';
import DatabaseService from './database.service';
import DatabaseTables from './database.tables';

@Module({})
export default class DatabaseModule {
  static forRoot(tableName: string): DynamicModule {
    if (!DatabaseTables[tableName])
      throw new Error(
        'Invalid configuration: table name is not registered in database.tables.',
      );

    const providers = [
      {
        provide: tableName,
        useValue: new DatabaseService(DatabaseTables[tableName]),
      },
    ];
    return {
      module: DatabaseModule,
      providers,
      exports: providers,
    };
  }
}
