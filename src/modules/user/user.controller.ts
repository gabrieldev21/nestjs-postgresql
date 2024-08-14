import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { SaveUserDto } from './dto/save-user.dto';
import { ListUserDto } from './dto/list-user.dto';
import { UpdateUser } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
  ) {}

  @Post()
  async createUser(@Body() userData: SaveUserDto) {
    const userEntity = new UserEntity();
    userEntity.name = userData.name;
    userEntity.email = userData.email;
    userEntity.password = userData.password;
    userEntity.id = uuid();

    this.userRepository.saveUser(userEntity);
    return {
      usuario: new ListUserDto(userEntity.id, userEntity.name),
      message: 'User created successfully',
    };
  }

  @Get()
  async getUsers() {
    const saveUsers = await this.userRepository.listUser();
    const listUsers = saveUsers.map(
      user => new ListUserDto(user.id, user.name),
    );

    return listUsers;
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() newUserData: UpdateUser) {
    const updatedUser = await this.userRepository.update(id, newUserData);

    return {
      usuario: updatedUser,
      message: 'User updated successfully',
    };
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    const removedUser = await this.userRepository.remove(id);

    return {
      usuario: removedUser,
      message: 'User removed successfully',
    };
  }
}
