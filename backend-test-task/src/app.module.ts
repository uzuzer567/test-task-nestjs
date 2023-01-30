import { Module } from '@nestjs/common';
import { ParkingModule } from './parking/parking.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ParkingModule, UserModule, AuthModule]
})
export class AppModule {}
