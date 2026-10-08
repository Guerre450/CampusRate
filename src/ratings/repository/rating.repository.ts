import { Injectable } from '@nestjs/common';
import { MongooseRepository } from 'src/common/repository/mongose-repository';
import { Rating } from '../entities/rating.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

type ratingStats = {
  count: number;
  average: number;
};

@Injectable()
export class RatingRepository extends MongooseRepository<Rating> {
  constructor(
    @InjectModel(Rating.name) private readonly ratingModel: Model<Rating>,
  ) {
    super(ratingModel);
  }
  /**
   * using an aggragation here to optimize getting of count and average for a place
   * @param placeId
   * @returns ratingStats
   */
  async placeTotalRatingStats(placeId: string): Promise<ratingStats> {
    return await this.ratingModel
      .aggregate([
        { $match: { placeId: placeId } },
        {
          $group: {
            _id: null,
            count: { $count: {} },
            average: { $avg: '$rating' },
          },
        },
      ])
      .exec()
      .then((result) => result[0] as ratingStats);
  }
}
