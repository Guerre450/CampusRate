/* eslint-disable */
import {
  Injectable,
  NestMiddleware,
  PayloadTooLargeException,
} from '@nestjs/common';

@Injectable()
export class SizeLimitMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.headers['content-length'] > 100000) {
      throw new PayloadTooLargeException('request entity too large');
    }
    next();
  }
}
