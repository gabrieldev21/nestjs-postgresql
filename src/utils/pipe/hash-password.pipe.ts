import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  constructor(private configService: ConfigService) {}

  async transform(password: string) {
    const secretPassword = this.configService.get<string>('SECRET_PASSWORD');

    if (!secretPassword)
      throw new NotFoundException('environment variable not set');

    const encryptedPassword = await bcrypt.hash(password, secretPassword);

    return encryptedPassword;
  }
}
