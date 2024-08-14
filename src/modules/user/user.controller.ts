import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { SaveUserDto } from './dto/save-user.dto';
import { ListUserDto } from './dto/list-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userData: SaveUserDto) {
    const userEntity = await this.userService.createUser(userData);

    return {
      usuario: new ListUserDto(userEntity.id, userEntity.name),
      message: 'User created successfully',
    };
  }

  @Get()
  getUsers() {
    return this.userService.listUsers();
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() newUserData: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateUser(id, newUserData);

    return {
      usuario: updatedUser,
      message: 'User updated successfully',
    };
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    const removedUser = await this.userService.deleteUser(id);

    return {
      usuario: removedUser,
      message: 'User removed successfully',
    };
  }
}
