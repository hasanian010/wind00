import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class ChangePhoneVerifyInput {
  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  code: string;
}
