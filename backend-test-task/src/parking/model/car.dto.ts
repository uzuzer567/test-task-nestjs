import { IsString, IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CarDto {
    @ApiProperty({ description: 'License plate of car', type: String })
    @IsString()
    @IsNotEmpty()
    licensePlate: string;
}