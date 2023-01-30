import {
    Controller,
    Post,
    HttpException,
    Delete,
    Param,
    Get,
    UseGuards,
    Request
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ParkingService } from './service/parking.service';

@Controller('parking')
export class ParkingController {
    constructor(private parkingService: ParkingService) { }

    @UseGuards(JwtAuthGuard)
    @Post('/park')
    async parkCar(@Request() request) {
        try {
            return await this.parkingService.parkCar(request.car);
        } catch (error) {
            return new HttpException({ status: false, message: error.response }, error.status);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/unpark/:carLicensePlate')
    async unparkCar(@Param('carLicensePlate') carLicensePlate: string) {
        try {
            return await this.parkingService.unparkCar(carLicensePlate);
        } catch (error) {
            return new HttpException({ status: false, message: error.response }, error.status);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/slot/:slotId')
    async getSlotInfo(@Param('slotId') slotId: number) {
        try {
            return await this.parkingService.getSlotInfo(slotId);
        } catch (error) {
            return new HttpException({ status: false, message: error.response }, error.status);
        }
    }
}
