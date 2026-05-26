import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly adminEmail =
    process.env.ADMIN_EMAIL ?? 'admin@teafactory.local';

  private readonly adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

  login(loginDto: LoginDto) {
    const isValidUser =
      loginDto.email === this.adminEmail &&
      loginDto.password === this.adminPassword;

    if (!isValidUser) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      accessToken: 'demo-admin-session',
      user: {
        name: 'Factory Admin',
        email: this.adminEmail,
        role: 'admin',
      },
    };
  }
}
