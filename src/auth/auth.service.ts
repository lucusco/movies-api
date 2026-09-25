import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import type { AuthenticatedUser } from './types/authenticated-user.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return null;
    }

    const { passwordHash, ...userData } = user.toObject();
    return userData;
  }

  async login(user: AuthenticatedUser) {
    const payload = { sub: user._id, email: user.email };

    return { token: this.jwtService.sign(payload) };
  }
}
