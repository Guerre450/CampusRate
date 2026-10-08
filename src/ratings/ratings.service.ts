/* eslint-disable */
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PlacesService } from 'src/places/places.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
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
    const stats = await this.ratingRepo.placeTotalRatingStats(placeId)
    const result = await this.placesService.placeRepo.updateByProperties(
      [
        {
          propertyName: 'id',
          value: placeId,
        },
      ],
      {
        averageRating: stats.average,
        reviewCount: stats.count,
        updatedAt: new Date(),
      },
    );
  }
}
