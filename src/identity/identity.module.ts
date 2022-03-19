import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityResolver } from './identity.resolver';
import { MailService } from 'src/mail/mail.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [HttpModule, AuthModule],
  providers: [IdentityResolver, IdentityService, MailService, UserService],
})
export class IdentityModule {}
