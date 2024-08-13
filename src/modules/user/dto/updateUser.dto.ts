import { IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';

import { IsEmailUnique } from 'src/utils/validator/isEmailUnique.validator';

export class UpdateUser {
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsEmailUnique({ message: 'Já existe usuário com este email' })
  @IsOptional()
  email: string;

  @MinLength(6)
  @IsOptional()
  password: string;
}
