import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({
    description: 'id of the place related to this',
    example: 'plc_skfjdas3asdsaf909gsda9s0',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100, { message: 'placeId is too long, max 100 characters' })
  @IsNotEmpty()
  placeId!: string;
  @ApiProperty({
    description: "author's name",
    example: 'simma',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100, { message: 'authorName is too long, max 100 characters' })
  @IsNotEmpty()
  authorName!: string;
  @ApiProperty({
    description: 'rating of the place',
    example: 3,
    minimum: 0,
    maximum: 5,
  })
  @IsInt()
  @IsNumber()
  @Min(0, { message: 'rating is too low, min 0' })
  @Max(5, { message: 'rating is too high, max 5' })
  @IsNotEmpty()
  rating!: number;
  @ApiProperty({
    description: 'comment of the rating',
    example: 'This place is so bad the slums might be better',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200, { message: 'comment is too long, max 200 characters' })
  @IsNotEmpty()
  comment!: string;
}
