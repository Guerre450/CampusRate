import {} from 'jest';
import { JsonRepository } from './json-repository';
import { FileHandle } from 'fs/promises';
import {} from './repository-interface';
type JsonRepoTest = {
  foo: number;
  pootisid: string;
};
function createMock<T>(): jest.Mocked<T> {
  return {} as jest.Mocked<T>;
}
// if the "Your test suite must contain at least one test." returns. just remove the node:test module
describe('json-repository-test', () => {
  let repo: JsonRepository<JsonRepoTest>;
  beforeEach(() => {
    jest.clearAllMocks();
    const fileHandler: FileHandle = createMock<FileHandle>();
    fileHandler.readFile = jest.fn();
    fileHandler.truncate = jest.fn();
    fileHandler.write = jest.fn();
    fileHandler.sync = jest.fn();
    fileHandler.read = jest.fn().mockReturnValue('[]');
    fileHandler.stat = jest.fn().mockReturnValue({ size: 0 });
    repo = new JsonRepository<JsonRepoTest>(fileHandler);
    repo.load = jest.fn();
  });
  it('is alive', () => {
    repo.load();
  });
  describe('create 1 elements', () => {
    it('create', async () => {
      return expect(
        await repo.create({ foo: 14, pootisid: '0-dasfdsad' }),
      ).toStrictEqual({
        data: { foo: 14, pootisid: '0-dasfdsad' },
        successful: true,
      });
    });

    it('element exists', async () => {
      await repo.create({ foo: 14, pootisid: '0-dasfdsad' });
      return expect(
        await repo.findByProperties([
          { propertyName: 'pootisid', value: '0-dasfdsad' },
        ]),
      ).toStrictEqual({
        data: { foo: 14, pootisid: '0-dasfdsad' },
        successful: true,
      });
    });
  });
  describe('find elements', () => {
    it('find one', async () => {
      await repo.createFromList([
        { foo: 14, pootisid: '0-dasfdsad' },
        { foo: 16, pootisid: '1-dasfdsad' },
        { foo: 27, pootisid: '2-dasfdsad' },
      ]);
      return expect(
        await repo.findByProperties([
          { propertyName: 'pootisid', value: '0-dasfdsad' },
        ]),
      ).toStrictEqual({
        data: { foo: 14, pootisid: '0-dasfdsad' },
        successful: true,
      });
    });
    it('find multiple', async () => {
      await repo.createFromList([
        { foo: 14, pootisid: '0-dasfdsad' },
        { foo: 14, pootisid: '1-dasfdsad' },
        { foo: 27, pootisid: '2-dasfdsad' },
      ]);
      return expect(
        await repo.listByProperties([{ propertyName: 'foo', value: '14' }]),
      ).toStrictEqual({
        data: [
          { foo: 14, pootisid: '0-dasfdsad' },
          { foo: 14, pootisid: '1-dasfdsad' },
        ],
        successful: true,
      });
    });
  });

  describe('update elements', () =>
    it('update one', async () => {
      await repo.create({ foo: 14, pootisid: '0-dasfdsad' });
      return expect(
        await repo.updateByProperties(
          [{ propertyName: 'pootisid', value: '0-dasfdsad' }],
          { foo: 16 },
        ),
      ).toStrictEqual({
        data: { foo: 16, pootisid: '0-dasfdsad' },
        successful: true,
      });
    }));

  describe('delete elements', () => {
    it('delete one', async () => {
      await repo.create({ foo: 14, pootisid: '0-dasfdsad' });
      await repo.deleteByProperties([
        { propertyName: 'pootisid', value: '0-dasfdsad' },
      ]);
      return expect(await repo.listByProperties([])).toStrictEqual({
        data: [],
        successful: true,
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
