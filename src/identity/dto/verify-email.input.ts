import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class VerifyEmailInput {
  @Field()
  token: string;

  @Field()
  code: number;
}
