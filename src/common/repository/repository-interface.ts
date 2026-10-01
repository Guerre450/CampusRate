/* eslint-disable */
export function propertyKeyListToObject(
  propertyKeyList: PropertyKey[],
): object {
  const object = {};
  propertyKeyList.forEach((propertyKey) => {
    object[propertyKey.propertyName] = propertyKey.value;
  });
  return object;
}
export function objectToPropertyKeyList(object: object): PropertyKey[] {
  const propertyKeyList: PropertyKey[] = [];
  Object.keys(object).forEach((key) => {
    propertyKeyList.push({
      propertyName: key,
      value: object[key],
    });
  });
  return propertyKeyList;
}
export type repoOperationResult<Type> = {
  successful: boolean;
  data?: Type;
};

export interface PropertyKey {
  propertyName: string;
  value: any;
}
export interface Repository<Type extends object> {
  createFromList: (entities: Type[]) => Promise<repoOperationResult<Type[]>>;
  create: (entity: Type) => Promise<repoOperationResult<Type>>;
  findByProperties: (
    properties: PropertyKey[],
  ) => Promise<repoOperationResult<Type>>;
  listByProperties: (
    properties: PropertyKey[],
  ) => Promise<repoOperationResult<Type[]>>;
  updateByProperties: (
    properties: PropertyKey[],
    updatedValues: Partial<Type>,
  ) => Promise<repoOperationResult<Type>>;
  deleteByProperties: (
    properties: PropertyKey[],
  ) => Promise<repoOperationResult<Type>>;
}
