import { IsString, IsNumber, IsNotEmpty } from '@nestjs/class-validator';

export class User {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password?: string;
}