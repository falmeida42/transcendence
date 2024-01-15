import { ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FTGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext) {
    try {
      return (await super.canActivate(context)) as boolean;
    } catch (error) {
      console.error(error);
                  // throw InternalServerErrorException;
    }
  }
}
