import { Injectable } from '@nestjs/common';
import {
  PropertyKey,
  propertyKeyListToObject,
  repoOperationResult,
  Repository,
} from './repository-interface';
import { Model } from 'mongoose';

@Injectable()
export class MongooseRepository<
  Type extends object,
> implements Repository<Type> {
  constructor(private readonly model: Model<Type>) {}
  createFromList: (entities: Type[]) => Promise<repoOperationResult<Type[]>>;

  async create(entity: Partial<Type>): Promise<repoOperationResult<Type>> {
    const result = await this.model.create(entity);
    return { successful: true, data: result };
  }
  async findByProperties(
    properties: PropertyKey[],
  ): Promise<repoOperationResult<Type>> {
    const result = await this.model
      .findOne(propertyKeyListToObject(properties))
      .exec();
    if (result === null) {
      return { successful: false };
    }
    return { successful: true, data: result };
  }
  async listByProperties(
    properties: PropertyKey[],
  ): Promise<repoOperationResult<Type[]>> {
    const result = await this.model
      .find(propertyKeyListToObject(properties))
      .exec();
    if (result === null) {
      return { successful: false };
    }
    return { successful: true, data: result };
  }
  async updateByProperties(
    properties: PropertyKey[],
    updatedValues: Partial<Type>,
  ): Promise<repoOperationResult<Type>> {
    const result = await this.model
      .findOneAndUpdate(propertyKeyListToObject(properties), updatedValues)
      .exec();
    if (result === null) {
      return { successful: false };
    }
    return { successful: true, data: result };
  }
  async deleteByProperties(
    properties: PropertyKey[],
  ): Promise<repoOperationResult<Type>> {
    const result = await this.model
      .findOneAndDelete(propertyKeyListToObject(properties))
      .exec();
    if (result === null) {
      return { successful: false };
    }
    return { successful: true, data: result };
  }
}
