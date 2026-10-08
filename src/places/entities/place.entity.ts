import { randomUUID } from 'crypto';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Place {
  @Prop({ type: String, default: () => 'plc_' + randomUUID(), unique: true })
  id!: string;
  @Prop({ required: true, unique : true})
  name!: string;
  @Prop({ required: true })
  description!: string;
  @Prop({ required: true, index: true })
  category!: string;
  @Prop({ required: true })
  address!: string;
  @Prop({ type: [String], default: () => [] })
  services: string[];
  @Prop({ default: () => 'ACTIVE' })
  status: string = 'ACTIVE';
  @Prop({ type: Number, default: () => null })
  averageRating: number;
  @Prop({ default: () => 0 })
  reviewCount: number = 0;
  @Prop({ default: () => new Date() })
  createdAt: Date;
  @Prop({ default: () => new Date() })
  updatedAt: Date;
}
