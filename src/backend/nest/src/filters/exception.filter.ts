import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class FTAuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception.getStatus() === HttpStatus.UNAUTHORIZED) {
      console.debug('********************CHEGOUU***************')
      // Handle 403 Forbidden error
      response.redirect(`${process.env.FRONTEND_URL}`); // Redirect to a custom error page
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
