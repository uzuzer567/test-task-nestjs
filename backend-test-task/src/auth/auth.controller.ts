import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
    ApiTags,
    ApiCreatedResponse,
    ApiUnprocessableEntityResponse,
    ApiForbiddenResponse
} from '@nestjs/swagger';
import { AuthService } from '../auth/service/auth.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('/login')
    @ApiCreatedResponse({ description: 'Request Completed Successfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    async login(@Request() request) {
        return this.authService.loginWithCredentials(request.user);
    }
}
