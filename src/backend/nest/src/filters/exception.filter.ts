import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class FTAuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (
      exception.getStatus() === HttpStatus.UNAUTHORIZED &&
      exception.message === 'fuckyou 42'
    ) {
      response.redirect(`${process.env.FRONTEND_URL}/login`); // Redirect to a custom error page
    } else {
      // For other errors, fall back to the default behavior
      response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
