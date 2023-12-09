import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('JwtAuthGuard');
    // Add your custom logic to check if the user is authenticated
    const request = context.switchToHttp().getRequest();
    if (request.isAuthenticated()) {
      return super.canActivate(context);
    }
  }
}
