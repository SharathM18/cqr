import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        message = (res as any).message || message;
        // For validation errors from DTO
        errors = Array.isArray((res as any).message)
          ? (res as any).message
          : null;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errors = exception.stack;
    }

    response.status(status).json({
      statusCode: status,
      success: false,
      message,
      errors,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
