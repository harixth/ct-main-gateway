import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Identity } from 'src/identity/entities/identity.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(id: string, name?: string): Promise<User> {
    return this.userService.findUser(id, true, { userId: id, name });
  }

  async findUser(userId: string): Promise<User> {
    return this.userService.findUser(userId);
  }

  async sign(userId: string, name: string, email: string) {
    const payload = { sub: userId, name, email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
