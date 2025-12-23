import fs from 'node:fs/promises';
import path from 'node:path';
import { TODO, UPDATED_TODO } from '../../typescript/todo/todo.interfaces';
import todoDB from './todo.json';
const db: { [key: string]: TODO } = todoDB;

export class DataBase {
  static async save(): Promise<boolean> {
    await fs.writeFile(
      path.resolve(__dirname.replace('dist', 'src'), 'todo.json'),
      JSON.stringify(db, null, 2),
    );
    return true;
  }
  static async create(obj: TODO): Promise<TODO | false> {
    try {
      db[obj.id] = obj;
      await this.save();
      return obj;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      return false;
    }
  }

  static find(searchKey?: string): TODO | TODO[] | false {
    try {
      if (!searchKey) {
        const keys: string[] = Object.keys(db);
        const todosArray: TODO[] = keys.map((key) => db[key]);
        return todosArray;
      }
      return db[searchKey];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      return false;
    }
  }

  static async remove(searchKey: string): Promise<TODO | false> {
    try {
      const todo: TODO = db[searchKey];
      delete db[searchKey];
      await this.save();
      return todo;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      return false;
    }
  }

  static async update(
    searchKey: string,
    updateObj: UPDATED_TODO,
  ): Promise<TODO | false> {
    try {
      db[searchKey] = { ...db[searchKey], ...updateObj };
      await this.save();
      return db[searchKey];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      return false;
    }
  }
}
