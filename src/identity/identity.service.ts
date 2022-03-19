import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { IDENTITY_SERVICE_URL } from './identity.constant';
import { CreateIdentityInput } from './dto/create-identity.input';
import { UpdateIdentityInput } from './dto/update-identity.input';

@Injectable()
export class IdentityService {
  constructor(
    private httpService: HttpService,
    private mailService: MailService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  /**
   * Create new identity for a user
   * @param {CreateIdentityInput} createIdentityInput - Input for creating an identity
   */
  async create(createIdentityInput: CreateIdentityInput) {
    try {
      const { email, password, phone } = createIdentityInput;
      const registerDto = {
        email,
        password: crypto
          .createHmac('sha256', password)
          .digest('hex')
          .toString(),
        phone,
        authCode: Math.floor(1000 + Math.random() * 9000),
        authToken: crypto.createHmac('sha256', email ?? phone).digest('hex'),
        verifyExpiry: (
          Math.round(new Date().getTime() / 1000) +
          24 * 3600
        ).toString(),
      };
      const response = await firstValueFrom(
        this.httpService.post(`${IDENTITY_SERVICE_URL}/register`, registerDto),
      );
      console.log(response.data);
      const { _id, email: _email, authCode } = response.data.identity;
      if (!_id) {
        throw new Error('Fail to create new account');
      }
      this.mailService.sendVerificationMail(_email, authCode);
      return response.data.identity;
    } catch (error) {
      const { message } = error.response?.data ?? error;
      console.error(message ?? error);
      throw new InternalServerErrorException(
        message ?? 'Something when wrong during account creation',
      );
    }
  }

  /**
   * Verify user email address
   * @param {string} token - authToken used to identify user's Identity
   * @param {number} code - The four digit number sent to user's email
   */
  async verifyEmail(token: string, code: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${IDENTITY_SERVICE_URL}/verifyEmail/${token}/${code}`,
        ),
      );
      const { _id, email } = response.data.identity;
      if (!_id) {
        throw new Error('Fail to verify email');
      }
      const user = await this.userService.create({
        userId: `local+${_id}`,
        name: 'howdy',
      });
      if (!user) {
        throw new Error('Fail to create new account');
      }
      return this.authService.sign(user.userId, user.name, email);
    } catch (error) {
      const { message } = error.response?.data ?? error;
      console.error(message ?? error);
      throw new InternalServerErrorException(
        message ?? 'Something when wrong during email verification',
      );
    }
  }

  /**
   * Sign user to the system
   * @param {string} username - user's email or phone number
   * @param {string} password - user's password
   */
  async login(username: string, password: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${IDENTITY_SERVICE_URL}/login`, {
          username,
          password,
        }),
      );
      const { _id, email } = response.data.identity;
      if (!_id) {
        throw new Error('Fail to find user');
      }
      const user = await this.userService.findUser(`local+${_id}`);
      if (!user) {
        throw new Error('Fail to create new account');
      }
      return this.authService.sign(user.userId, user.name, email);
    } catch (error) {
      const { message } = error.response?.data ?? error;
      console.error(message ?? error);
      throw new InternalServerErrorException(
        message ?? 'Something when wrong during sign in',
      );
    }
  }

  /**
   * Request for password reset link
   * @param {string} username - user's email or phone number
   */
  async forgotPassword(username: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${IDENTITY_SERVICE_URL}/forgot-password/${username}`,
        ),
      );
      const { _id, email, authToken } = response.data.identity;
      if (!_id) {
        throw new Error('Fail to find user');
      }
      this.mailService.sendResetPasswordMail(email, 'howdy', authToken);
      return response.data.identity;
    } catch (error) {
      const { message } = error.response?.data ?? error;
      console.error(message ?? error);
      throw new InternalServerErrorException(
        message ?? 'Something when wrong during requesting password reset link',
      );
    }
  }

  /**
   * Reset password
   * @param {string} token - user's system Id
   */
  async resetPassword(token: string, password: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(
          `${IDENTITY_SERVICE_URL}/reset-password/${token}`,
          {
            password: crypto
              .createHmac('sha256', password)
              .digest('hex')
              .toString(),
          },
        ),
      );
      const { _id } = response.data.identity;
      if (!_id) {
        throw new Error('Fail to find user');
      }
      return response.data.identity;
    } catch (error) {
      const { message } = error.response?.data ?? error;
      console.error(message ?? error);
      throw new InternalServerErrorException(
        message ?? 'Something when wrong during password reset',
      );
    }
  }

  /**
   * Change password
   * @param {string} id - user's system Id
   */
  async changePassword(id: string, oldPassword: string, password: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${IDENTITY_SERVICE_URL}/change-password/${id}`, {
          oldPassword: crypto
            .createHmac('sha256', oldPassword)
            .digest('hex')
            .toString(),
          password: crypto
            .createHmac('sha256', password)
            .digest('hex')
            .toString(),
        }),
      );
      const { _id } = response.data.identity;
      if (!_id) {
        throw new Error('Fail to find user');
      }
      return response.data.identity;
    } catch (error) {
      const { message } = error.response?.data ?? error;
      console.error(message ?? error);
      throw new InternalServerErrorException(
        message ?? 'Something when wrong during changing password',
      );
    }
  }

  async findOne(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${IDENTITY_SERVICE_URL}/identity/${id}`),
      );
      const { _id } = response.data.identity;
      if (!_id) {
        throw new Error('Fail to find user');
      }
      return response.data.identity;
    } catch (error) {
      const { message } = error.response?.data ?? error;
      console.error(message ?? error);
      throw new InternalServerErrorException(
        message ?? 'Something when wrong during finding user profile',
      );
    }
  }

  /* Not Implemented Services */

  findAll() {
    return `This action returns all identity`;
  }

  update(id: number, updateIdentityInput: UpdateIdentityInput) {
    return `This action updates a #${id} identity`;
  }

  remove(id: number) {
    return `This action removes a #${id} identity`;
  }
}
