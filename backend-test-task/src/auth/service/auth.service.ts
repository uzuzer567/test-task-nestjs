import { Injectable } from '@nestjs/common';
import { User } from '../../user/model/user';
import { UserRepository } from '../../user/service/user.repository';

@Injectable()
export class AuthService {
    constructor(private userRepository: UserRepository) { }

    async validateUser(username: string, pass: string): Promise<User | null> {
        const user: User = await this.userRepository.getUserByUsername(username);
        if(user && user.password === pass) {
            const {password, ...secureUser} = user;
            return secureUser;
        } 
        return null;
    }
}