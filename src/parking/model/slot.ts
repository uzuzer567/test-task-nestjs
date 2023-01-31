import { IsString, IsBoolean, IsNotEmpty } from '@nestjs/class-validator';

export class Slot {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  isEmpty: boolean;

  @IsString()
  @IsNotEmpty()
  carLicensePlate?: string;

  @IsString()
  @IsNotEmpty()
  lastCarLicensePlate?: string;
}
