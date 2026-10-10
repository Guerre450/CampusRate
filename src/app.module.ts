import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PlacesModule } from './places/places.module';
import { RatingsModule } from './ratings/ratings.module';
import * as Joi from 'joi';
import databaseConfig from './config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig], //  Loads the database.config
      validationSchema: Joi.object({
        // if any mongo config is missing from the database.config it will crash the application with a readeable message
        MONGO_PORT: Joi.string().required(),
        MONGO_DOMAIN: Joi.string().required(),
        MONGO_USERNAME: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_DB: Joi.string().required(),
        PORT: Joi.number().default(3000),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Gets the type and security
        uri: configService.get<string>('database.uri'),
        // Recommended production option
        autoIndex: process.env.NODE_ENV !== 'production', // Deactivate auto-indexing in prod for performance
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
    PlacesModule,
    RatingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
