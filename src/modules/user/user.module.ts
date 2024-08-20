import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { IsEmailUniqueValidator } from 'src/utils/validator/isEmailUnique.validator';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, IsEmailUniqueValidator],
  exports: [UserService],
})
export class UserModule {}
