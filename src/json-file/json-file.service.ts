import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync } from 'fs';

@Injectable()
export class JSONFileService {
  exists(path: string): boolean {
    return existsSync(path);
  }

  read<T extends Record<string, any>>(path: string): T {
    const jsonString = readFileSync(path, { encoding: 'utf-8' });
    return JSON.parse(jsonString);
  }

  write<T extends Record<string, any>>(path: string, json: T): void {
    writeFileSync(path, JSON.stringify(json));
  }
}
