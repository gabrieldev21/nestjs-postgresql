import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAuthenticationDto {
  @IsEmail(undefined, { message: 'Email provided is invalid.' })
  email: string;

  @IsNotEmpty({ message: 'Password not set.' })
  password: string;
}
