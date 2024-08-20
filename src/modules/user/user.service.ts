import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { ListUserDto } from './dto/list-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SaveUserDto } from './dto/save-user.dto';

Injectable();
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async listUsers() {
    const savedUser = await this.userRepository.find();
    return savedUser.map(user => new ListUserDto(user.id, user.name));
  }

  async createUser(saveUserDto: SaveUserDto) {
    const userEntity = new UserEntity();

    Object.assign(userEntity, saveUserDto as UserEntity);

    return this.userRepository.save(userEntity);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException(`User ${id} not found`);

    Object.assign(user, updateUserDto as UserEntity);

    await this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    await this.userRepository.delete(id);
  }

  async isEmailUnique(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !user;
  }
}
