import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const path = request.route.path;
    const url = request.url;
    const date = new Date().toLocaleTimeString();
    const { statusCode: status } = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(() => {
        const logResp = { method, path, url, status, date };
        Logger.log(JSON.stringify(logResp), context.getClass().name);
      }),
    );
  }
}
