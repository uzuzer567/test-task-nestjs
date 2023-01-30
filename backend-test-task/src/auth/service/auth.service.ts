import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/model/user';
import { UserRepository } from '../../user/repository/user.repository';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private jwtTokenService: JwtService
    ) { }

    async validateUser(username: string, pass: string): Promise<User | null> {
        const user: User = await this.userRepository.getUserByUsername(username);
        if(user && user.password === pass) {
            const {password, ...secureUser} = user;
            return secureUser;
        } 
        return null;
    }

    async loginWithCredentials(user: User) {
        const payload = { username: user.username, sub: user.id};

        return {
            accessToken: this.jwtTokenService.sign(payload),
        };
    }
}