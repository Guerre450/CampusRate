/* eslint-disable */
import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { ProblemDetailsDto } from './problem-details.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    this.logger.warn(`
      ${new Date().toISOString()} : WARN
      - ${request.url} - ${request.method}
      - ${status}
      - ${exception.name}
      - ${exception.message}
      - stack:
      ${exception.stack}
      `)
    const problemDetailsDto: ProblemDetailsDto = {
      type: 'about:blank',
      title: exception.name,
      detail: exception.message,
      instance: request.url,
      status: status,
      errors: [`${exception.cause}`],
    };
    response.status(status).json(problemDetailsDto);
  }
}
