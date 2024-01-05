import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable()
export class TokenExpirationInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (this.tokenExpiredError(error)) {
          const res = ctx.switchToHttp().getResponse();

          res.redirect(`http://localhost:3000/auth/login`);
        }
        throw error;
      }),
    );
  }
  private tokenExpiredError(error: any): boolean {
    return (
      error instanceof HttpException &&
      error.getStatus() === HttpStatus.UNAUTHORIZED &&
      error.message === 'Unauthorized'
    );
  }
}
