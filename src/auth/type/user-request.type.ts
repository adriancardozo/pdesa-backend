import type { Request } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import type { User } from 'src/user/entity/user.entity';

export interface UserRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>,
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user: User;
}
