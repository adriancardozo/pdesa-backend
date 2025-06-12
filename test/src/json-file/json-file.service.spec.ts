import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'test/resources/mocks/mock';
import { exists, json, jsonString, path } from './test-data/json-file.service.spec.data';
import { JSONFileService } from 'src/json-file/json-file.service';
import fsModule from 'fs';

describe('JSONFileService', () => {
  let module: TestingModule;
  let service: JSONFileService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [JSONFileService],
    })
      .useMocker(mock)
      .compile();

    service = module.get<JSONFileService>(JSONFileService);
  });

  describe('Exists file', () => {
    let existsSync: jest.SpyInstance;

    beforeEach(() => {
      existsSync = jest.spyOn(fsModule, 'existsSync');
      existsSync.mockReturnValue(exists);
    });

    it('should check if file exists', () => {
      service.exists(path);
      expect(existsSync).toHaveBeenCalledWith(path);
    });

    it('should return file exists result', () => {
      const result = service.exists(path);
      expect(result).toEqual(exists);
    });
  });

  describe('Read file', () => {
    let readFileSync: jest.SpyInstance;

    beforeEach(() => {
      readFileSync = jest.spyOn(fsModule, 'readFileSync');
      readFileSync.mockReturnValue(jsonString);
    });

    it('should read json file', () => {
      service.read(path);
      expect(readFileSync).toHaveBeenCalledWith(path, { encoding: 'utf-8' });
    });

    it('should parse json file string', () => {
      const parseMethod = jest.spyOn(JSON, 'parse');
      service.read(path);
      expect(parseMethod).toHaveBeenCalledWith(jsonString);
    });

    it('should return parsed json', () => {
      const result = service.read(path);
      expect(result).toEqual(json);
    });
  });

  describe('Write file', () => {
    let writeFileSync: jest.SpyInstance;

    beforeEach(() => {
      writeFileSync = jest.spyOn(fsModule, 'writeFileSync');
      writeFileSync.mockReturnValue(null);
    });

    it('should convert json to string', () => {
      const stringifyMethod = jest.spyOn(JSON, 'stringify');
      service.write(path, json);
      expect(stringifyMethod).toHaveBeenCalledWith(json);
    });

    it('should write json file string', () => {
      service.write(path, json);
      expect(writeFileSync).toHaveBeenCalledWith(path, jsonString);
    });
  });

  afterEach(async () => {
    await module.close();
    jest.restoreAllMocks();
  });
});
