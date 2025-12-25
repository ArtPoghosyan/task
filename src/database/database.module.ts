import path from 'node:path';
import fs from 'node:fs';
import { Injectable } from '@nestjs/common';
import { TABLE_FILE } from 'src/typescript/database/table.interfaces';
import { update } from 'mingo';
import sift from 'sift';

@Injectable()
export default class DatabaseModule {
  private tablePath: string;

  constructor(private readonly table: string) {
    this.tablePath = path.resolve(
      __dirname.replace('dist', 'src'),
      'tables',
      table + '.json',
    );

    if (!fs.existsSync(this.tablePath)) {
      const tableInfo: TABLE_FILE = {
        created_at: new Date(),
        path: this.tablePath,
        format: 'JSON',
        name: table,
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

  async create(obj: object): Promise<object | void> {
    const tableFile = await this.getTable();
    tableFile.table.push(obj);
    await this.saveTable(tableFile);

    return obj;
  }
  async find(query?: object): Promise<object | object[] | null | void> {
    const tableFile = await this.getTable();
    if (!query) return tableFile.table;

    const findItems = tableFile.table.filter(sift(query));
    return findItems.length === 0
      ? null
      : findItems.length === 1
        ? findItems[0]
        : findItems;
  }
  async remove(query?: object): Promise<object | object[] | null | void> {
    const tableFile = await this.getTable();
    const findItems = !query ? tableFile.table : [];
    if (!query) {
      tableFile.table = [];
    } else {
      const matcher = sift(query);
      tableFile.table = tableFile.table.filter((item) => {
        if (!matcher(item)) return item;
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
  async update(
    query: object | null | undefined = undefined,
    updateObj: object,
    now: false = false,
  ): Promise<object | object[] | null> {
    const tableFile = await this.getTable();

    const findItems: object[] = !query ? tableFile.table : [];
    if (!query) {
      tableFile.table = tableFile.table.map(() => updateObj);
    } else {
      const matcher = sift(query);
      tableFile.table = tableFile.table.map((item) => {
        if (matcher(item)) {
          const i: any = item;
          if (now) {
            update(i, updateObj);
            findItems.push(item);
          } else {
            findItems.push(item);
            update(i, updateObj);
          }

          return item;
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
}
