import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Place } from '../entities/place.entity';

export type placeDocument = HydratedDocument<Place>;

export const PlaceSchema = SchemaFactory.createForClass(Place);

//updates updatedAt field
PlaceSchema.pre('save', function () {
  this.updatedAt = new Date();
});
