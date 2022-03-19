import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { WEB_BASEURL } from 'src/mail/mail.constant';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { DiscordAuthGuard } from './guards/discord-auth';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   * GET /auth/discord
   * This is the route the user will visit to authenticate with discord
   */
  @Get('discord')
  @UseGuards(DiscordAuthGuard)
  async login() {
    return;
  }

  /**
   * GET /api/auth/redirect
   * This is the redirect URL the OAuth2 Provider will call.
   */
  @Get('discord/redirect')
  @UseGuards(DiscordAuthGuard)
  async redirect(@Req() req: Request, @Res() res: Response) {
    const { userId, name, email } = req.user as User;
    const { accessToken } = await this.authService.sign(userId, name, email);
    res.redirect(`${WEB_BASEURL}/auth/social?token=${accessToken}`);
  }
}
