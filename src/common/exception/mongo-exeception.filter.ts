/* eslint-disable */
import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import mongoose from 'mongoose';

@Catch(mongoose.mongo.MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MongoExceptionFilter.name);
  catch(exception: mongoose.mongo.MongoError, host: ArgumentsHost) {
    this.logger.error(`
      ${new Date().toISOString()} : ERROR
      - ${exception.name}
      - ${exception.message}
      - stack:
      ${exception.stack}
      `)
      switch (exception.code) {
      case 11000:   // duplicate exception
        const key = exception.message.split("dup key: ")[1]
        throw new ConflictException(`The following property already exists : ${key}`);
    }
  }
}
