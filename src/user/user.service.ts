import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { USER_SERVICE_URL } from './user.constants';

@Injectable()
export class UserService {
  constructor(private httpService: HttpService) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${USER_SERVICE_URL}/new`, createUserInput),
      );
      const { _id, userId: _userId } = response.data.user;
      if (!_id) {
        throw new Error('Fail to create new user');
      }
      return response.data.user;
    } catch (error) {
      const { message } = error.response?.data ?? error;
      console.error(message ?? error);
      throw new InternalServerErrorException(
        message ?? 'Something when wrong during user creation',
      );
    }
  }

  async findUser(
    id: string,
    createIfMissing?: boolean,
    createUserInput?: CreateUserInput,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${USER_SERVICE_URL}/user/${id}`),
      );
      const { _id, userId: _userId } = response.data.user;
      if (!_id) {
        throw new Error('Fail to retrieve user');
      }
      return response.data.user;
    } catch (error) {
      const { message } = error.response?.data ?? error;
      if (createIfMissing && message === 'User not found') {
        return this.create(createUserInput);
      }
      console.error(message ?? error);
      throw new InternalServerErrorException(
        message ?? 'Something when wrong during user retrieval',
      );
    }
  }

  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  // findAll() {
  //   return `This action returns all user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
