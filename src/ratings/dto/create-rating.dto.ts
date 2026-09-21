import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({
    description: 'id of the place related to this',
    example: 'plc_skfjdas3asdsaf909gsda9s0',
  })
  @IsString()
  @IsNotEmpty()
  placeId!: string;
  @ApiProperty({
    description: "author's name",
    example: 'simma',
  })
  @IsString()
  @IsNotEmpty()
  authorName!: string;
  @ApiProperty({
    description: 'rating of the place',
    example: 3,
  })
  @IsInt()
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsNotEmpty()
  rating!: number;
  @ApiProperty({
    description: 'comment of the rating',
    example: 'This place is so bad the slums might be better',
  })
  @IsString()
  @IsNotEmpty()
  comment!: string;
}
