import { CreateIdentityInput } from './create-identity.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateIdentityInput extends PartialType(CreateIdentityInput) {
  @Field(() => Int)
  id: number;
}
