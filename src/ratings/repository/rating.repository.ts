import { Injectable } from '@nestjs/common';
import { MongooseRepository } from 'src/common/repository/mongose-repository';
import { Rating } from '../entities/rating.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RatingRepository extends MongooseRepository<Rating> {
  constructor(
    @InjectModel(Rating.name) private readonly ratingModel: Model<Rating>,
  ) {
    super(ratingModel);
  }
}
