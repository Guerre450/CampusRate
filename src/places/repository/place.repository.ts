import { Injectable } from '@nestjs/common';
import { MongooseRepository } from 'src/common/repository/mongose-repository';
import { Place } from '../entities/place.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlaceRepository extends MongooseRepository<Place> {
  constructor(
    @InjectModel(Place.name) private readonly placeModel: Model<Place>,
  ) {
    super(placeModel);
  }
}
