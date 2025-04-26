import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async data(password: string): Promise<string> {
    const SALT = bcrypt.genSaltSync();
    return await bcrypt.hash(password, SALT);
  }

  compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
