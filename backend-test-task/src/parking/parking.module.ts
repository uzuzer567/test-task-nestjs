import { Module } from '@nestjs/common';
import { ParkingController } from './parking.controller';
import { ParkingService } from './service/parking.service';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
      ParkingModule,
      AuthModule,
      ConfigModule.forRoot({
        envFilePath: '.env'
      })
    ],
    controllers: [ParkingController],
    providers: [ParkingService]
})


export class ParkingModule { }