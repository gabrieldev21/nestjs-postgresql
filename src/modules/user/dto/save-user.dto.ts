import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

import { IsEmailUnique } from 'src/utils/validator/isEmailUnique.validator';

export class SaveUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsEmailUnique({ message: 'Este email já está em uso.' })
  email: string;

  @MinLength(6)
  password: string;
}
