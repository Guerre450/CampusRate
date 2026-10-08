/* eslint-disable */
import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, ConflictException } from '@nestjs/common';
import mongoose from 'mongoose';

@Catch(mongoose.mongo.MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: mongoose.mongo.MongoError, host: ArgumentsHost) {
        switch (exception.code) {
      case 11000:   // duplicate exception
        const key = exception.message.split("dup key: ")[1]
        throw new ConflictException(`The following property already exists : ${key}`);
    }
  }
}
