import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

export function configureSecurity(app: INestApplication): void {
  app.use(helmet());
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
}
