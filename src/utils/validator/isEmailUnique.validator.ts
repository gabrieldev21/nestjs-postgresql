import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsEmailUniqueValidator implements ValidatorConstraintInterface {
  constructor(private userRepository: UserRepository) {}

  async validate(value: any): Promise<boolean> {
    const existUserWithEmail = await this.userRepository.existWithEmail(value);
    return !existUserWithEmail;
  }
}

export const IsEmailUnique = (validationOptions: ValidationOptions) => {
  return (object: object, property: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: property,
      options: validationOptions,
      constraints: [],
      validator: IsEmailUniqueValidator,
    });
  };
};
