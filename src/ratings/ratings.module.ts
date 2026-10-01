import { forwardRef, Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { PlacesModule } from 'src/places/places.module';
import { PlacesService } from 'src/places/places.service';
import { RatingRepository } from './repository/rating.repository';
import { Rating } from './entities/rating.entity';
import { RatingSchema } from './schema/rating.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [RatingsController],
  providers: [RatingsService, PlacesService, RatingRepository],
  imports: [
    forwardRef(() => PlacesModule),
    MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
  ],
  exports: [RatingsService, RatingRepository],
})
export class RatingsModule {}
