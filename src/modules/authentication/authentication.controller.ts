import { Controller, Post, Body } from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  create(@Body() { email, password }: CreateAuthenticationDto) {
    return this.authenticationService.login(email, password);
  }
}
