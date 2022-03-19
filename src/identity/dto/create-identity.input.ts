import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateIdentityInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  password: string;
}
