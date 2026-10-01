/* eslint-disable */
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { ProblemDetailsDto } from './problem-details.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
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
