import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  phone: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => String)
  provider: string;

  @Field(() => Boolean)
  isVerified: boolean;

  @Field(() => Boolean)
  isBanned: boolean;

  @Field(() => String)
  role: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}

@ObjectType()
export class GetUsers {
  @Field(() => [User])
  results: User[];

  @Field(() => Int)
  itemCount: number;

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  itemsPerPage: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;
}
