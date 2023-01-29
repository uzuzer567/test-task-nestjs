import { Module } from '@nestjs/common';
import { ParkingController } from './parking.controller';
import { ParkingService } from './service/parking.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ParkingModule,
        ConfigModule.forRoot({
          envFilePath: '.env'
        })
    ],
    controllers: [ParkingController],
    providers: [ParkingService]
})


export class ParkingModule { }