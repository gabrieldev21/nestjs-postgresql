import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { ListUserDto } from './dto/list-user.dto';

Injectable();
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async listUsers() {
    const savedUser = await this._userRepository.find();
    const listUser = savedUser.map(user => new ListUserDto(user.id, user.name));

    return listUser;
  }
}
