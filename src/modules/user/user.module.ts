import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { IsEmailUniqueValidator } from 'src/utils/validator/isEmailUnique.validator';

@Module({
  controllers: [UserController],
  providers: [UserRepository, IsEmailUniqueValidator],
})
export class UserModule {}
