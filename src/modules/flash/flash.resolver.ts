import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class FlashResolver {
  @Query(() => String, { name: 'flashStatus' })
  flashStatus(): string {
    return 'وضعیت فلش‌ها از ماژول فلش';
  }
}
