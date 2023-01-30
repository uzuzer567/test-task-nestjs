import { Module } from '@nestjs/common';
import { UserRepository } from './service/user.repository';

@Module({
    providers: [UserRepository],
    exports: [UserRepository]
})

export class UserModule { }