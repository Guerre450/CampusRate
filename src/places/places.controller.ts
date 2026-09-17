import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { ProblemDetailsDto } from 'src/common/exception/problem-details.dto';
import { PageDetailsDto } from 'src/common/page-details/page-details.dto';
@ApiTags('Places')
@ApiBadRequestResponse({
  description: 'invalid data',
  type: ProblemDetailsDto,
})
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}
  @ApiOperation({
    summary: 'Creates a place',
    description: 'Creates a place in the database',
  })
  @ApiCreatedResponse({
    description: 'The created place',
  })
  @Post()
  async create(@Body() createPlaceDto: CreatePlaceDto) {
    return await this.placesService.create(createPlaceDto);
  }
  @ApiOperation({
    summary: 'A list of places',
    description: 'Returns all the places filtered and in page format',
  })
  @ApiOkResponse({
    description: 'List of places in page format',
    type: PageDetailsDto,
  })
  @Get()
  async findAll(
    @Query('category', new ValidationPipe({})) category?: string,
    @Query('page', new ParseIntPipe()) page: number = 1,
    @Query('limit', new ParseIntPipe()) limit: number = 2,
  ) {
    return await this.placesService.findAll(category, page, limit);
  }
  @ApiOperation({
    summary: 'Find place by id',
    description: "Finds a place by it's id and returns it",
  })
  @ApiOkResponse({
    description: 'Returns the found place',
  })
  @ApiParam({
    name: 'id',
    description: 'Uuid of the place',
    format: 'uuid',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.placesService.findOne(id);
  }
  @ApiOperation({
    summary: 'Update place by id',
    description: "Finds a place by it's id and update it",
  })
  @ApiOkResponse({
    description: 'Updates the found place',
  })
  @ApiParam({
    name: 'id',
    description: 'Uuid of the place',
    format: 'uuid',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ) {
    return await this.placesService.update(id, updatePlaceDto);
  }

  @ApiOperation({
    summary: 'Update places by id',
    description: "Finds a place by it's id and update it",
  })
  @ApiNoContentResponse({
    description: 'No content is displayed for deletion operation',
  })
  @ApiParam({
    name: 'id',
    description: 'Uuid of the place',
    format: 'uuid',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.placesService.remove(id);
  }
}
