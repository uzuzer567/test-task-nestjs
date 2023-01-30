import { Injectable } from '@nestjs/common';
import { User } from '../model/user';

@Injectable()
export class UserRepository {
    private users: User[];
    
    constructor() {
        this.users = [
            {
                id: 1,
                username: 'user',
                password: 'user'
            }
        ];
    }

    async getUserByUsername(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
}