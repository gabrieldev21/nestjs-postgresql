import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthenticationService {
  constructor(private readonly userService: UserService) {}

  async login(email: string, receivedPassword: string) {
    const user = await this.userService.findByEmail(email);

    const authenticatedUser = await bcrypt.compare(
      receivedPassword,
      user.password,
    );

    if (!authenticatedUser)
      throw new UnauthorizedException('Invalid email or password');

    return 'This action adds a new authentication';
  }
}
