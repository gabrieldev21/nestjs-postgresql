import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsString,
} from 'class-validator';

import { IsEmailUnique } from 'src/utils/validator/isEmailUnique.validator';

export class SaveUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsEmailUnique({ message: 'Este email já está em uso.' })
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;
}
