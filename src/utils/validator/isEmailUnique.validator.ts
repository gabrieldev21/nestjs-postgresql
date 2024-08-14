import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

import { UserService } from 'src/modules/user/user.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsEmailUniqueValidator implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(email: string): Promise<boolean> {
    return this.userService.isEmailUnique(email);
  }

  defaultMessage(): string {
    return 'Já existe um usuário com este email';
  }
}

export const IsEmailUnique = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailUniqueValidator,
    });
  };
};
