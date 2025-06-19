import { plainToInstance } from 'class-transformer';
import { RefreshTokenResult } from 'src/mercado-libre/entity/refresh-token-result.entity';
import { refreshTokenResultJson } from './test-data/refresh-token-result.entity.spec.data';

describe('RefreshTokenResult', () => {
  let refreshTokenResult: RefreshTokenResult;

  beforeEach(() => {
    refreshTokenResult = plainToInstance(RefreshTokenResult, refreshTokenResultJson);
  });

  describe('token', () => {
    it('should return access token', () => {
      expect(refreshTokenResult.token).toEqual(refreshTokenResultJson.access_token);
    });
  });

  describe('bearer', () => {
    it('should return bearer access token', () => {
      expect(refreshTokenResult.bearer).toEqual(`Bearer ${refreshTokenResultJson.access_token}`);
    });
  });

  describe('refresh', () => {
    it('should return refresh token', () => {
      expect(refreshTokenResult.refresh).toEqual(refreshTokenResultJson.refresh_token);
    });
  });
});
