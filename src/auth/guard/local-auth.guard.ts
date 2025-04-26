import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ValidationService } from 'src/validation/validation.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly validationService: ValidationService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body }: Request = context.switchToHttp().getRequest();
    await this.validationService.transform(body, LoginDto, 'body');
    return (await super.canActivate(context)) as boolean;
  }
}
