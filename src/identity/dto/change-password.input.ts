import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ChangePasswordInput {
  @Field()
  id: string;

  @Field()
  oldPassword: string;

  @Field()
  password: string;
}
