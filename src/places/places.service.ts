import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PageDetailsDto } from 'src/common/page-details/page-details.dto';
import { RatingsService } from 'src/ratings/ratings.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Place } from './entities/place.entity';
import { PropertyKey } from 'src/common/repository/repository-interface';
import { PlaceRepository } from './repository/place.repository';
@Injectable()
export class PlacesService {
  constructor(
    @Inject(forwardRef(() => RatingsService))
    private readonly ratingsService: RatingsService,
    readonly placeRepo: PlaceRepository,
  ) {}

  async create(createPlaceDto: CreatePlaceDto) {
    const result = await this.placeRepo.create(createPlaceDto);
    if (!result.successful) {
      throw new BadRequestException("Couldn't create entity");
    }

    return result.data ?? {};
  }

  async findAll(category?: string, page: number = 1, limit: number = 1) {
    const filter: PropertyKey[] = [];
    if (category) {
      if (
        ![
          'STUDY_SPACE',
          'LIBRARY',
          'FOOD_SERVICE',
          'SPORTS',
          'STUDENT_SERVICE',
          'COMPUTER_LAB',
          'OTHER',
        ].includes(category)
      ) {
        throw new BadRequestException(
          `Category ${category} not one of : "STUDY_SPACE", "LIBRARY", "FOOD_SERVICE", "SPORTS", "STUDENT_SERVICE", "COMPUTER_LAB", "OTHER"`,
        );
      }

      filter.push({
        propertyName: 'category',
        value: category,
      });
    }
    const result = await this.placeRepo.listByProperties(filter);
    if (!result.successful) {
      throw new InternalServerErrorException('This is not supposed to happen');
    }
    const returnedData = result.data ?? [];
    const totalItems = returnedData.length;
    const totalPages = Math.ceil(returnedData.length / limit);
    const fomatting: PageDetailsDto<Place> = {
      data: returnedData.splice((page - 1) * limit, limit),
      pagination: {
        page: page,
        limit: limit,
        totalItems: totalItems,
        totalPages: totalPages,
      },
    };
    return fomatting;
  }

  async findOne(id: string) {
    const result = await this.placeRepo.findByProperties([
      {
        propertyName: 'id',
        value: id,
      },
    ]);
    if (!result.successful) {
      throw new BadRequestException(
        `Did not find the place with the requested id : ${id}`,
      );
    }
    return result.data ?? {};
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto) {
    const result = await this.placeRepo.updateByProperties(
      [
        {
          propertyName: 'id',
          value: id,
        },
      ],
      { ...updatePlaceDto, updatedAt: new Date() },
    );
    if (!result.successful) {
      throw new BadRequestException(
        `Did not find the place with the requested id : ${id}`,
      );
    }
    return result.data ?? {};
  }

  async remove(id: string) {
    if ((await this.ratingsService.findAll(id)).length > 0) {
      throw new BadRequestException('Cannot delete a place which has ratings');
    }
    const result = await this.placeRepo.deleteByProperties([
      {
        propertyName: 'id',
        value: id,
      },
    ]);
    if (!result.successful) {
      throw new BadRequestException(
        `Did not find the place with the requested id : ${id}`,
      );
    }
    return '';
  }
}
