import {
    Controller,
    Post,
    HttpException,
    Delete,
    Param,
    Get,
    UseGuards,
    Body
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ParkingService } from './service/parking.service';
import { Car } from '../parking/model/car';

@Controller('parking')
export class ParkingController {
    constructor(private parkingService: ParkingService) { }

    @UseGuards(JwtAuthGuard)
    @Post('/park')
    async parkCar(@Body() car: Car) {
        try {
            let selectedSlot = await this.parkingService.parkCar(car);
            if (selectedSlot) {
                let response = {
                    status: true,
                    data: selectedSlot,
                    message: 'Car is parked.'
                }
                return response;
            }
        } catch (error) {
            throw new HttpException({ status: false, message: error.response }, error.status);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/unpark/:carLicensePlate')
    async unparkCar(@Param('carLicensePlate') carLicensePlate: string) {
        try {
            let vacatedSlot = await this.parkingService.unparkCar(carLicensePlate);
            if (vacatedSlot) {
                let response = {
                    status: true,
                    data: vacatedSlot,
                    message: 'Parking slot vacated.'
                }
                return response;
            }
        } catch (error) {
            throw new HttpException({ status: false, message: error.response }, error.status);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/slot/:id')
    async getSlotDetails(@Param('id') id: string) {
        try {
            let slotInfo = await this.parkingService.getSlotDetails(id);
            var response = {
                status: true,
                data: slotInfo,
                message: "Details of given slot."
            }
            return response;
        } catch (error) {
            throw new HttpException({ status: false, message: error.response }, error.status);
        }
    }
}
