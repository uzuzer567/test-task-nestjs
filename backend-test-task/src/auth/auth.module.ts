import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './service/auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './service/local.strategy';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './service/jwt.strategy';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.SECRET_KEY || 'secret key',
            signOptions: {expiresIn: '60s'}
          })
    ],
    exports: [AuthService],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy]
})

export class AuthModule { }