import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, any>
{
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((response: any) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        success: true,
        message: response.message || 'Operation successful',
        data: response.data || response,
      })),
    );
  }
}
