/* eslint-disable */
import { FileHandle } from 'fs/promises';
import {
  repoOperationResult,
  PropertyKey,
  Repository,
  objectToPropertyKeyList,
} from './repository-interface';

export function doesObjectHasFields(
  data: object,
  properties: PropertyKey[],
): boolean {
  properties.forEach((element) => {
    if (!data.hasOwnProperty(element.propertyName)) {
      return false;
    }
  });
  return true;
}
export function doesObjectListHasFields(
  datas: object[],
  properties: PropertyKey[],
): boolean {
  datas.forEach((element) => {
    if (!doesObjectHasFields(element, properties)) {
      return false;
    }
  });
  return true;
}

export class JsonRepository<Type extends object> implements Repository<Type> {
  private datas: Type[] = [];
  private fileHandler!: FileHandle;

  constructor(fileHandlerTemp: FileHandle) {
    this.fileHandler = fileHandlerTemp;
  }

  private async write() {
    await this.fileHandler.truncate();
    await this.fileHandler.write(JSON.stringify(this.datas), 0);
    await this.fileHandler.sync();
  }

  async load() {
    await this.fileHandler.sync();
    await this.read();
  }
  private async read() {
    try {
      const stats = await this.fileHandler.stat();
      let buffer = Buffer.alloc(stats.size); // Allocate a buffer to hold the data
      buffer = (await this.fileHandler.read(buffer, 0, buffer.length, 0))
        .buffer;
      const tempDatas: object[] = JSON.parse(buffer.toString());

      if (
        !doesObjectListHasFields(
          tempDatas,
          objectToPropertyKeyList(new Object()),
        )
      ) {
        throw SyntaxError();
      }
      this.datas = tempDatas as Type[];
    } catch (exception: any) {
      if (exception instanceof SyntaxError) {
        //console.log(exception.stack)
        console.log(`json has incorrect type, memory data will be used...`);
      } else {
        if (exception instanceof Error) {
          console.error(exception.message);
        }
      }
    }
  }

  length(): number {
    return this.datas.length;
  }

  async createFromList(entities: Type[]): Promise<repoOperationResult<Type[]>> {
    await this.load();
    this.datas = this.datas.concat(entities);
    await this.write();
    return { successful: true, data: entities };
  }

  async create(entity: Type): Promise<repoOperationResult<Type>> {
    await this.load();
    this.datas.push(entity);
    await this.write();
    return { successful: true, data: entity };
  }

  private doesDataHasValue(data: Type, properties: PropertyKey[]): boolean {
    let result = true;
    properties.forEach((element) => {
      if (!data.hasOwnProperty(element.propertyName)) {
        result = false;
        return;
      }
      if (data[element.propertyName] != element.value) {
        result = false;
      }
    });
    return result;
  }

  async findByProperties(
    properties: PropertyKey[],
  ): Promise<repoOperationResult<Type>> {
    await this.load();
    const result = this.datas.find((data) => {
      return this.doesDataHasValue(data, properties);
    });
    if (result) {
      return { successful: true, data: result };
    }
    return { successful: false };
  }
  async listByProperties(
    properties: PropertyKey[] = [],
  ): Promise<repoOperationResult<Type[]>> {
    await this.load();
    const result = this.datas.filter((data) => {
      return this.doesDataHasValue(data, properties);
    });
    if (result) {
      return { successful: true, data: result };
    }
    return { successful: false };
  }

  private findIndexByProperties(properties: PropertyKey[]): number {
    return this.datas.findIndex((data) => {
      return this.doesDataHasValue(data, properties);
    });
  }

  async updateByProperties(
    properties: PropertyKey[],
    updatedValues: Partial<Type>,
  ): Promise<repoOperationResult<Type>> {
    await this.load();
    return await this.update(
      this.findIndexByProperties(properties),
      updatedValues,
    );
  }
  private async update(
    index: number,
    updatedValues: Partial<Type>,
  ): Promise<repoOperationResult<Type>> {
    if (index === -1) {
      return { successful: false };
    }
    Object.assign(this.datas[index], updatedValues);
    await this.write();
    return { successful: true, data: this.datas[index] };
  }
  async deleteByProperties(
    properties: PropertyKey[],
  ): Promise<repoOperationResult<Type>> {
    await this.load();
    return await this.delete(this.findIndexByProperties(properties));
  }

  private async delete(index: number): Promise<repoOperationResult<Type>> {
    if (index < 0) {
      return { successful: false };
    }
    const results = this.datas.splice(index, 1);
    if (results.length > 0) {
      await this.write();
      return {
        successful: true,
        data: results[0],
      };
    }
    return { successful: false };
  }

  async close() {
    await this.fileHandler.close();
  }
}
