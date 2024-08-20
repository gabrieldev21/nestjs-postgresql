import { PartialType } from '@nestjs/mapped-types';

import { SaveUserDto } from './save-user.dto';

export class UpdateUserDto extends PartialType(SaveUserDto) {}
