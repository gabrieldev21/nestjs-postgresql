import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository {
  private users: UserEntity[] = [];
  private searchById(id: string) {
    const possibleUsers = this.users.find(user => user.id === id);

    if (!possibleUsers) {
      throw new Error(`User ${id} does not exist`);
    }

    return possibleUsers;
  }

  async saveUser(user: UserEntity) {
    this.users.push(user);
  }

  async listUser() {
    return this.users;
  }

  async existWithEmail(email: string) {
    const possibleEmail = this.users.find(user => user.email === email);

    return possibleEmail !== undefined;
  }

  async update(id: string, dataUser: Partial<UserEntity>) {
    const users = this.searchById(id);

    Object.entries(dataUser).forEach(([key, value]) => {
      if (key === 'id') {
        return;
      }

      users[key] = value;
    });

    return users;
  }

  async remove(id: string) {
    const user = this.searchById(id);
    this.users = this.users.filter(user => user.id !== id);

    return user;
  }
}
