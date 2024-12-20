import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  // In-memory storage
  private readonly users: Map<string, User> = new Map();

  async findOne(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async create(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }
}
