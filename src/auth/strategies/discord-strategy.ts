import { Profile, Strategy } from 'passport-discord';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.DISCORD_CLIENT_ID ?? '950538413503807568',
      clientSecret:
        process.env.DISCORD_CLIENT_SECRET ?? 'sl7clll6p_b7idJsWdigfGuYg5LQPWr5',
      callbackURL:
        process.env.DISCORD_CALLBACK_URL ??
        'http://localhost:4000/auth/discord/redirect',
      scope: ['identify', 'email', 'guilds'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const { username, id: discordId, name, email } = profile;
    const user = await this.authService.validateUser(
      `discord+${discordId}`,
      name?.givenName ?? 'howdy',
    );
    return { ...user, email: email };
  }
}
