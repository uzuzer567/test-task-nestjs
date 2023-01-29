import { Controller, Post, Body, ValidationPipe, HttpException, Delete, Param } from '@nestjs/common';
import { ParkingService } from './service/parking.service';

@Controller('parking')
export class ParkingController {
    constructor(private parkingService: ParkingService) { }

    @Post('/park/:carLicensePlate')
    parkCar(@Body(new ValidationPipe()) carLicensePlate: string): object {
        try {
            let selectedSlot = this.parkingService.parkCar(carLicensePlate);
            let response = {
                status: true,
                data: selectedSlot,
                message: 'Car is parked.'
            }
            return response;
        } catch (error) {
            throw new HttpException({ status: false, message: error.response }, error.status);
        }
    }

    @Delete('/unpark/:carLicensePlate')
    unparkCar(@Param('carLicensePlate') carLicensePlate: string): object {
        try {
            let car = this.parkingService.unparkCar(carLicensePlate);
            let response = {
                status: true,
                data: car,
                message: 'Parking slot vacated.'
            }
            return response;
        } catch (error) {
            throw new HttpException({ status: false, message: error.response }, error.status);
        }
    }
}
