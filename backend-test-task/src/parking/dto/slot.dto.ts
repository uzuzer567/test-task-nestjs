import { IsString, IsBoolean, IsNumber, IsNotEmpty } from '@nestjs/class-validator';

export class SlotDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsBoolean()
    @IsNotEmpty()
    isEmpty: boolean;

    @IsString()
    @IsNotEmpty()
    carLicensePlate: string;
}