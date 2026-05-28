import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  // In-memory user storage (for demo purposes)
  private users = [
    {
      id: 1,
      email: 'admin@teafactory.local',
      password: 'admin123',
      name: 'Factory Admin',
    },
  ];

  private adminEmail =
    process.env.ADMIN_EMAIL ?? 'admin@teafactory.local';

  private adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

  login(loginDto: LoginDto) {
    const user = this.users.find(
      (u) => u.email === loginDto.email && u.password === loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      access_token: `token-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'user',
      },
    };
  }

  signup(signupDto: SignupDto) {
    // Check if user already exists
    const existingUser = this.users.find((u) => u.email === signupDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Validate password
    if (!signupDto.password || signupDto.password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long',
      );
    }

    // Create new user
    const newUser = {
      id: this.users.length + 1,
      email: signupDto.email,
      password: signupDto.password,
      name: signupDto.email.split('@')[0], // Use email prefix as name
    };

    this.users.push(newUser);

    return {
      access_token: `token-${newUser.id}-${Date.now()}`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: 'user',
      },
    };
  }
}
