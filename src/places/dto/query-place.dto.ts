import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class QueryPlaceDto {
  @ApiProperty({
    description: 'Category which the place belongs to',
    examples: [
      'STUDY_SPACE',
      'LIBRARY',
      'FOOD_SERVICE',
      'SPORTS',
      'STUDENT_SERVICE',
      'COMPUTER_LAB',
      'OTHER',
    ],
  })
  @IsIn([
    'STUDY_SPACE',
    'LIBRARY',
    'FOOD_SERVICE',
    'SPORTS',
    'STUDENT_SERVICE',
    'COMPUTER_LAB',
    'OTHER',
  ])
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'category is too long, max 100 characters' })
  category?: string;
  @ApiProperty({
    description: 'page to display',
    example: 0,
  })
  @Type(() => Number)
  @IsInt({ message: 'is not integer' })
  @Min(1, { message: 'page is too low, min 1' })
  @IsNumber()
  @IsOptional()
  page?: number;
  @ApiProperty({
    description: 'limit of element to display by page',
    example: 100,
    maxLength: 100,
  })
  @Type(() => Number)
  @IsInt({ message: 'is not integer' })
  @IsNumber()
  @Max(100, { message: 'limit is too high, max 100' })
  @Min(1, { message: 'limit is too low, min 1' })
  @IsOptional()
  limit?: number;
}
