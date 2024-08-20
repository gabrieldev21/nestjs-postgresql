import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserPayload } from './types/user-payload';
import { RequestWithUser } from './types/request-with-user';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  private extractHeaderToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    const bearer = 'Bearer';

    return type === bearer ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractHeaderToken(request);

    if (!token) throw new UnauthorizedException('Authentication error');

    try {
      const payload: UserPayload = await this.jwtService.verifyAsync(token);

      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }

    return true;
  }
}
