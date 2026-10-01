/* eslint-disable */
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './entities/rating.entity';
import { openJsonDataFile } from 'src/common/json/json-operations';
import { JsonRepository } from 'src/common/repository/json-repository';
import { PlacesService } from 'src/places/places.service';
import { RatingRepository } from './repository/rating.repository';

@Injectable()
export class RatingsService {
  constructor(
    @Inject(forwardRef(() => PlacesService))
    private placesService: PlacesService,
    readonly ratingRepo: RatingRepository,
  ) {}

  async create(createRatingDto: CreateRatingDto) {
    const result = await this.placesService.findOne(createRatingDto.placeId);
    if (result) {
      const result = await this.ratingRepo.create(createRatingDto);
      if (!result.successful) {
        throw new BadRequestException("Couldn't create Rating");
      }
      if (result.data) {
        await this.updatePlaceRating(result.data.placeId);
      }
      return result.data ?? {};
    }
  }

  async findAll(placeId: string) {
    const result = await this.ratingRepo.listByProperties([
      {
        propertyName: 'placeId',
        value: placeId,
      },
    ]);
    if (!result.successful) {
      throw new InternalServerErrorException(
        'This is never supposed to happen',
      );
    }
    return result.data ?? [];
  }

  async findOne(id: string) {
    const result = await this.ratingRepo.findByProperties([
      {
        propertyName: 'id',
        value: id,
      },
    ]);
    if (!result.successful) {
      throw new BadRequestException(
        `Couldn't find the rating with the provided id : ${id}`,
      );
    }
    return result.data ?? {};
  }

  async update(id: string, updateRatingDto: UpdateRatingDto) {
    const result = await this.ratingRepo.updateByProperties(
      [
        {
          propertyName: 'id',
          value: id,
        },
      ],
      { ...updateRatingDto, updatedAt: new Date() },
    );
    if (!result.successful) {
      throw new BadRequestException(
        `Did not find the rating with the requested id : ${id}`,
      );
    }
    if (result.data) {
      await this.updatePlaceRating(result.data.placeId);
    }
    return result.data ?? {};
  }

  async remove(id: string) {
    const result = await this.ratingRepo.deleteByProperties([
      {
        propertyName: 'id',
        value: id,
      },
    ]);
    if (!result.successful) {
      throw new BadRequestException(
        `Couldn't find the requested rating for deletion with the id : ${id} `,
      );
    }
    if (result.data) {
      await this.updatePlaceRating(result.data.placeId);
    }
    return '';
  }
  // Bad Implementation, but i'm not complaining due to time restraints
  async updatePlaceRating(placeId: string) {
    const relatedRatings = await this.findAll(placeId);
    const relatedRatingsCount = relatedRatings.length;
    const relatedRatingsAvg =
      relatedRatings.reduce(
        (prev: number, currentValue, currentIndex) =>
          prev + currentValue.rating,
        0,
      ) / relatedRatingsCount;
    const result = await this.placesService.placeRepo.updateByProperties(
      [
        {
          propertyName: 'id',
          value: placeId,
        },
      ],
      {
        averageRating: relatedRatingsAvg,
        reviewCount: relatedRatingsCount,
        updatedAt: new Date(),
      },
    );
  }
}
