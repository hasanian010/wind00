import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class BrandResolver {
  @Query(() => String, { name: 'brandStatus' })
  brandStatus(): string {
    return 'وضعیت برندها از ماژول برند';
  }
}
