import { IsString, IsNotEmpty } from '@nestjs/class-validator';

export class Car {
    @IsString()
    @IsNotEmpty()
    licensePlate: string;
}