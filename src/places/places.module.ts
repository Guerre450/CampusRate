import { forwardRef, Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { RatingsService } from 'src/ratings/ratings.service';
import { RatingsModule } from 'src/ratings/ratings.module';
import { PlaceRepository } from './repository/place.repository';
import { Place } from './entities/place.entity';
import { PlaceSchema } from './schema/place.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService, RatingsService, PlaceRepository],
  exports: [PlacesService, PlaceRepository],
  imports: [
    forwardRef(() => RatingsModule),
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
  ],
})
export class PlacesModule {}
