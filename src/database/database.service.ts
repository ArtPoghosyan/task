import path from 'node:path';
import fs from 'node:fs';
import { Injectable } from '@nestjs/common';
import {
  TABLE_FILE,
  TABLE_ITEM,
} from 'src/database/interfaces/table.interfaces';

@Injectable()
export default class DatabaseService {
  private tablePath: string;

  constructor(tableName: string) {
    this.tablePath = path.resolve(
      __dirname.replace('dist', 'src'),
      'tables',
      tableName + '.json',
    );

    if (!fs.existsSync(this.tablePath)) {
      const tableInfo: TABLE_FILE = {
        created_at: new Date(),
        path: this.tablePath,
        format: 'JSON',
        name: tableName,
        table: [],
      };
      fs.writeFileSync(this.tablePath, JSON.stringify(tableInfo, null, 2));
    }
  }

  async saveTable(tableFile: TABLE_FILE): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(this.tablePath, {
        encoding: 'utf-8',
      });

      writeStream.write(JSON.stringify(tableFile, null, 2));
      writeStream.end();

      writeStream.on('finish', () => {
        resolve(true);
      });
      writeStream.on('error', (err) => {
        reject(err);
      });
    });
  }
  async getTable(): Promise<TABLE_FILE> {
    return new Promise((resolve, reject) => {
      let jsonData: string = '';
      const readStream = fs.createReadStream(this.tablePath, {
        encoding: 'utf8',
      });

      readStream.on('data', (chunk) => {
        jsonData += chunk.toString('ascii');
      });
      readStream.on('end', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsedData: TABLE_FILE = JSON.parse(jsonData);
        resolve(parsedData);
      });
      readStream.on('error', (err) => {
        console.error('Error reading file:', err);
        reject(err);
      });
    });
  }

  async create(obj: TABLE_ITEM): Promise<object> {
    const tableFile = await this.getTable();
    tableFile.table.push(obj);
    await this.saveTable(tableFile);

    return obj;
  }
  async find(query?: number): Promise<TABLE_ITEM | TABLE_ITEM[] | null> {
    const tableFile = await this.getTable();
    if (!query) return tableFile.table;

    const findItems = tableFile.table.filter((item) => item.id === query);
    return findItems.length === 0
      ? null
      : findItems.length === 1
        ? findItems[0]
        : findItems;
  }
  async update(
    query: number | null | undefined,
    updateObj: { [key: string]: any },
    now: false = false,
  ): Promise<TABLE_ITEM | TABLE_ITEM[] | null> {
    const tableFile = await this.getTable();

    const findItems: TABLE_ITEM[] = !query ? tableFile.table : [];
    if (!query) {
      tableFile.table = tableFile.table.map((item) => ({
        ...item,
        ...updateObj,
      }));
    } else {
      tableFile.table = tableFile.table.map((item) => {
        if (item.id === query) {
          const newItem = { ...item, ...updateObj };
          findItems.push(now ? newItem : item);
          return newItem;
        }
        return item;
      });
    }
    await this.saveTable(tableFile);

    return findItems.length === 0
      ? null
      : findItems.length === 1
        ? findItems[0]
        : findItems;
  }
  async remove(query?: number): Promise<TABLE_ITEM | TABLE_ITEM[] | null> {
    const tableFile = await this.getTable();

    const findItems = !query ? tableFile.table : [];
    if (!query) {
      tableFile.table = [];
    } else {
      tableFile.table = tableFile.table.filter((item) => {
        if (item.id != query) return item;
        findItems.push(item);
      });
    }
    await this.saveTable(tableFile);

    return findItems.length === 0
      ? null
      : findItems.length === 1
        ? findItems[0]
        : findItems;
  }
}
