import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { GraphqlJwtAuthGuard } from 'src/auth/guards/graphql-jwt-auth';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/auth.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: 'user' })
  findOne(@Args('userId') userId: string) {
    return this.userService.findUser(userId);
  }

  @Query(() => User)
  @UseGuards(GraphqlJwtAuthGuard)
  async getCurrentUser(
    @CurrentUser() currentUser: { sub: string; name: string; email: string },
  ) {
    const user = await this.userService.findUser(currentUser.sub);
    return { ...user, email: currentUser.email };
  }

  // @Query(() => User, { name: 'user' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.userService.findOne(id);
  // }

  // @Mutation(() => User)
  // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //   return this.userService.update(updateUserInput.id, updateUserInput);
  // }

  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.userService.create(createUserInput);
  // }

  // @Query(() => [User], { name: 'user' })
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Mutation(() => User)
  // removeUser(@Args('id', { type: () => Int }) id: number) {
  //   return this.userService.remove(id);
  // }
}
