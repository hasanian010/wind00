import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class TagResolver {
  @Query(() => String, { name: 'tagStatus' })
  tagStatus(): string {
    return 'وضعیت تگ‌ها از ماژول تگ';
  }
}
