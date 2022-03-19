import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Identity {
  @Field((type) => ID)
  _id: number;

  @Field({ nullable: true })
  email?: string;

  @Field({ defaultValue: false })
  emailVerified: boolean;

  @Field({ nullable: true })
  phone?: string;

  @Field({ defaultValue: false })
  phoneVerified: boolean;

  @Field()
  password: string;

  @Field()
  authToken: string;

  @Field()
  authCode: number;

  @Field()
  verifyExpiry: string;

  @Field({ nullable: true })
  accessToken?: string;
}
