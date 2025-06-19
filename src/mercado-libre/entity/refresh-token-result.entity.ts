import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenResult {
  @IsString()
  @IsNotEmpty()
  access_token: string;
  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  token_type?: string;
  expires_in?: number;
  scope?: string;
  user_id?: number;

  get token(): string {
    return this.access_token;
  }

  get bearer(): string {
    return `Bearer ${this.access_token}`;
  }

  get refresh(): string {
    return this.refresh_token;
  }
}
