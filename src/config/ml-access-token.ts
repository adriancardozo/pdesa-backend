import { JSON_FILE_SERVICE } from 'src/shared/json-file/json-file.service';

export type MercadoLibreTokenJSON = { token?: string; refresh?: string };

export function mlAccessToken(
  path: string,
  accessToken?: string,
  refreshToken?: string,
): MercadoLibreTokenJSON {
  const exists = JSON_FILE_SERVICE.exists(path);
  if (!exists) JSON_FILE_SERVICE.write(path, { token: accessToken, refresh: refreshToken });
  const { token, refresh } = JSON_FILE_SERVICE.read<MercadoLibreTokenJSON>(path);
  return { token, refresh };
}
