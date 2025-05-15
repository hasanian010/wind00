import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SuccessInfo {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  message: string;

  @Field(() => String, { nullable: true })
  token?: string;
}
