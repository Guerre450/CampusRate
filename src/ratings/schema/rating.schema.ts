import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Rating } from '../entities/rating.entity';

export type ratingDocument = HydratedDocument<Rating>;

export const RatingSchema = SchemaFactory.createForClass(Rating);

//updates updatedAt field
RatingSchema.pre('save', function () {
  this.updatedAt = new Date();
});
