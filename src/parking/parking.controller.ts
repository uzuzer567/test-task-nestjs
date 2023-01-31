import {
  Controller,
  Post,
  HttpException,
  Delete,
  Param,
  Get,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ParkingService } from './service/parking.service';
import { CarDto } from './model/car.dto';

@ApiTags('Parking')
@Controller('parking')
export class ParkingController {
  constructor(private parkingService: ParkingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/park')
  @ApiCreatedResponse({ description: 'Request Completed Successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async parkCar(@Body() car: CarDto) {
    try {
      const selectedSlot = await this.parkingService.parkCar(car);
      if (selectedSlot) {
        const response = {
          status: true,
          data: selectedSlot,
          message: 'Car is parked.',
        };
        return response;
      }
    } catch (error) {
      throw new HttpException(
        { status: false, message: error.response },
        error.status,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/unpark/:carLicensePlate')
  @ApiOkResponse({ description: 'Resource was deleted successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async unparkCar(@Param('carLicensePlate') carLicensePlate: string) {
    try {
      const vacatedSlot = await this.parkingService.unparkCar(carLicensePlate);
      if (vacatedSlot) {
        const response = {
          status: true,
          data: vacatedSlot,
          message: 'Parking slot vacated.',
        };
        return response;
      }
    } catch (error) {
      throw new HttpException(
        { status: false, message: error.response },
        error.status,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/slot/:id')
  @ApiOkResponse({ description: 'Resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async getSlotDetails(@Param('id') id: string) {
    try {
      const slotInfo = await this.parkingService.getSlotDetails(id);
      const response = {
        status: true,
        data: slotInfo,
        message: 'Details of given slot.',
      };
      return response;
    } catch (error) {
      throw new HttpException(
        { status: false, message: error.response },
        error.status,
      );
    }
  }
}
