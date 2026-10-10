import {
  Injectable,
  NestMiddleware,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ContentTypeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const contentType = req.headers['content-type'];

    const allowedContentTypes = ['application/json'];

    if (
      contentType &&
      !allowedContentTypes.some((type) => contentType.startsWith(type))
    ) {
      throw new UnsupportedMediaTypeException(
        'The chosen media type is unsupported',
      );
    }

    next();
  }
}
