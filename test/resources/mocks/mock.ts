import { ModuleMocker } from 'jest-mock';

type Class<T> = new (...args: any[]) => T;

const mocker = new ModuleMocker(global);

export function mock<T>(OriginalClass: Class<T>): jest.Mocked<T> {
  const metadata = mocker.getMetadata(OriginalClass);
  if (!metadata) throw new Error('Class is not mockeable');
  const Mocked = mocker.generateFromMetadata(metadata);
  return new Mocked() as jest.Mocked<T>;
}
