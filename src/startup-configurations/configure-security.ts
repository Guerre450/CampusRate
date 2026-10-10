/* eslint-disable */
import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import { ContentTypeMiddleware } from 'src/common/middleware/content-type.middleware';
import { SizeLimitMiddleware } from 'src/common/middleware/size-limit.middleware';
export function configureSecurity(app: INestApplication): void {
  app.use(helmet());
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.use(new SizeLimitMiddleware().use);
  app.use(new ContentTypeMiddleware().use);
}
