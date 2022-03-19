import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { IdentityService } from './identity.service';
import { Identity } from './entities/identity.entity';
import { CreateIdentityInput } from './dto/create-identity.input';
import { UpdateIdentityInput } from './dto/update-identity.input';
import { VerifyEmailInput } from './dto/verify-email.input';
import { LoginInput } from './dto/login.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/auth.decorator';
import { GraphqlJwtAuthGuard } from 'src/auth/guards/graphql-jwt-auth';

@Resolver(() => Identity)
export class IdentityResolver {
  constructor(private readonly identityService: IdentityService) {}

  @Mutation(() => Identity)
  createIdentity(
    @Args('createIdentityInput') createIdentityInput: CreateIdentityInput,
  ) {
    return this.identityService.create(createIdentityInput);
  }

  @Mutation(() => Identity)
  verifyEmail(@Args('verifyEmailInput') verifyEmailInput: VerifyEmailInput) {
    const { token, code } = verifyEmailInput;
    return this.identityService.verifyEmail(token, code);
  }

  @Mutation(() => Identity)
  login(@Args('loginInput') loginInput: LoginInput) {
    const { username, password } = loginInput;
    return this.identityService.login(username, password);
  }

  @Query(() => Identity, { name: 'forgotPassword' })
  forgotPassword(@Args('username') username: string) {
    return this.identityService.forgotPassword(username);
  }

  @Mutation(() => Identity)
  resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ) {
    const { token, password } = resetPasswordInput;
    return this.identityService.resetPassword(token, password);
  }

  @Mutation(() => Identity)
  changePassword(
    @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
  ) {
    const { id, oldPassword, password } = changePasswordInput;
    return this.identityService.changePassword(id, oldPassword, password);
  }

  @Query(() => Identity)
  @UseGuards(GraphqlJwtAuthGuard)
  whoAmI(@CurrentUser() identity: { sub: number; email: string }) {
    return this.identityService.findOne(identity.sub);
  }

  /* Not Implemented Resolvers*/

  @Query(() => [Identity], { name: 'identity' })
  findAll() {
    return this.identityService.findAll();
  }

  @Query(() => Identity, { name: 'identity' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.identityService.findOne(id);
  }

  @Mutation(() => Identity)
  updateIdentity(
    @Args('updateIdentityInput') updateIdentityInput: UpdateIdentityInput,
  ) {
    return this.identityService.update(
      updateIdentityInput.id,
      updateIdentityInput,
    );
  }

  @Mutation(() => Identity)
  removeIdentity(@Args('id', { type: () => Int }) id: number) {
    return this.identityService.remove(id);
  }
}
