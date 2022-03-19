import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';

type Done = (err: Error, id: string) => void;

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: User, done: Done) {
    done(null, user.userId);
  }

  async deserializeUser(user: User, done: Done) {
    try {
      const userDB = await this.authService.findUser(user.userId);
      return userDB ? done(null, userDB.userId) : done(null, null);
    } catch (err) {
      return done(null, null);
    }
  }
}
