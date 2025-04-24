import { DATA_SOURCE_OPTIONS } from '../config/data-source.options';

jest.doMock('src/config/data-source.options.ts', () => ({ DATA_SOURCE_OPTIONS }));
