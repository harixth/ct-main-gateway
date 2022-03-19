import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './auth.constant';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt-strategy';
import { AuthController } from './auth.controller';
import { DiscordStrategy } from './strategies/discord-strategy';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { SessionSerializer } from './auth.serializer';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '86400s' },
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, DiscordStrategy, SessionSerializer],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
