import {
  CallHandler,
  ConsoleLogger,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

import { RequestWithUser } from '../../modules/authentication/types/request-with-user';

@Injectable()
export class GlobalLoggerInterceptor implements NestInterceptor {
  constructor(private readonly nativeLogger: ConsoleLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request | RequestWithUser>();
    const response = httpContext.getResponse<Response>();
    const { path, method } = request;
    const { statusCode } = response;
    const preControllerInstant = Date.now();
    const user = 'user';

    this.nativeLogger.log(`${method} ${path}`);

    return next.handle().pipe(
      tap(() => {
        if (user in request) {
          this.nativeLogger.log(`Accessed route by user ${request.user.sub}`);
        }
        const routeTimeExecuted = Date.now() - preControllerInstant;
        this.nativeLogger.log(
          `Response: status ${statusCode} - ${routeTimeExecuted}ms`,
        );
      }),
    );
  }
}
