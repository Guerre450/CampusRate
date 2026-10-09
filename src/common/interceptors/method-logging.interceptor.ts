/* eslint-disable */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class MethodLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MethodLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      originalUrl: string;
    }>();
    const response = context.switchToHttp().getResponse()
    const startedAt = Date.now();
    const timestamp = new Date().toISOString();
    return next.handle().pipe(
      finalize(() => {
        const duration = Date.now() - startedAt;
        const statusCode = response.statusCode;
        this.logger.log(
          `
          ${timestamp} : ${request.method}
          - ${request.originalUrl}
          - expected status: ${statusCode}
          - ${duration} ms
          `,
        );
      }),
    );
  }
}
