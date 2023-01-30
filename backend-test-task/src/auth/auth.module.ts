import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './service/local.strategy';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [UserModule, PassportModule],
    exports: [AuthService],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy]
})

export class AuthModule { }