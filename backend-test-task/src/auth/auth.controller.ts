import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/service/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    @Post('/login')
    @UseGuards(AuthGuard('local'))
    login(@Request() request) {
        return request.user;
    }
}
