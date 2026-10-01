import { randomUUID } from 'crypto';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Rating {
  @Prop({ type: String, default: () => 'rev_' + randomUUID(), unique: true })
  id!: string;
  @Prop({ required: true })
  placeId!: string;
  @Prop({ required: true })
  authorName!: string;
  @Prop({ required: true })
  rating!: number;
  @Prop({ required: true })
  comment!: string;
  @Prop({ default: () => new Date() })
  createdAt!: Date;
  @Prop({ default: () => new Date() })
  updatedAt!: Date;
}
