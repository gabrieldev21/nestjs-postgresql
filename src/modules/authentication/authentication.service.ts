import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { UserPayload } from './types/user-payload';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, receivedPassword: string) {
    const user = await this.userService.findByEmail(email);

    const authenticatedUser = await bcrypt.compare(
      receivedPassword,
      user.password,
    );

    if (!authenticatedUser)
      throw new UnauthorizedException('Invalid email or password');

    const userPayload: UserPayload = {
      sub: user.id,
      userName: user.name,
    };

    return {
      accessToken: await this.jwtService.signAsync(userPayload),
    };
  }
}
