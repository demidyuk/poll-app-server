import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { User } from '../models';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async createToken(userId: string) {
    const user: JwtPayload = { userId };
    const accessToken = this.jwtService.sign(user);
    return accessToken;
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    return await this.usersService.find(payload.userId);
  }
}
