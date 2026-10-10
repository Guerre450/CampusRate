import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { MethodLoggingInterceptor } from 'src/common/interceptors/method-logging.interceptor';
import { PostInterceptor } from 'src/common/interceptors/post.interceptor';

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors: ValidationError[]) => {
        let message = '\n';
        validationErrors.forEach(
          (error) =>
            (message +=
              `[${error.property}]: ` +
              Object.values(error.constraints ?? {}).join(',') +
              '\n'),
        );
        return new BadRequestException(message, {});
      },
    }),
  );
  app.useGlobalInterceptors(
    new PostInterceptor(),
    new MethodLoggingInterceptor(),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
}
