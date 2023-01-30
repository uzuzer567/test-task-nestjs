import { IsString, IsBoolean, IsNumber, IsNotEmpty } from '@nestjs/class-validator';

export class Slot {
    @IsNumber()
    @IsNotEmpty()
    id: number;

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