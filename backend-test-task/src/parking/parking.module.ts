import { Module } from '@nestjs/common';
import { ParkingController } from './parking.controller';
import { ParkingService } from './service/parking.service';


@Module({
    controllers: [ParkingController],
    providers: [ParkingService]
})


export class ParkingModule { }