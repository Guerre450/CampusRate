import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePlaceDto {
  @ApiProperty({
    description: 'Name of the place',
    example: 'blibliotheque principale',
    maxLength : 50
  })
  @IsString()
  @MaxLength(50, {message: "Name is too long, max 50 characters"})
  @IsNotEmpty({message : "Name is not present"})
  name!: string;
  @ApiProperty({
    description: 'Description of the place',
    example: 'Espace calme avec prises',
    maxLength : 150
  })
  
  @IsString()
  @MaxLength(150, {message: "description is too long, max 150 characters"})
  @IsNotEmpty()
  description!: string;
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
  @IsIn(
    [
          'STUDY_SPACE',
          'LIBRARY',
          'FOOD_SERVICE',
          'SPORTS',
          'STUDENT_SERVICE',
          'COMPUTER_LAB',
          'OTHER',
        ]
  )
  @IsString()
  @MaxLength(100,  {message: "category is too long, max 100 characters"})
  @IsNotEmpty()
  category!: string;
  @ApiProperty({
    description: 'Address of the place',
    example: 'Pavillon A local A-210',
  })
  @IsString()
  @MaxLength(150,  {message: "address is too long, max 150 characters"})
  @IsNotEmpty()
  address!: string;
  @ApiProperty({
    description: 'services offered by the place',
    example: ['WIFI', 'POWER_OUTLETS'],
    maxLength : 150
  })
  @IsArray()
  @MaxLength(50, {each: true, message : "one element is too long, max 50 characters per element" })
  @IsOptional()
  services?: string[];
  @ApiProperty({
    description: 'status of the place',
    examples: ['ACTIVE', 'TEMPORARILY_CLOSED', 'INACTIVE'],
    maxLength: 50
  })
  @IsString()
 @MaxLength(100, {message: "status is too long, max 100 characters"})
  @IsOptional()
  status?: string;
}
