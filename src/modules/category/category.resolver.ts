import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class CategoryResolver {
  @Query(() => String, { name: 'categoryStatus' })
  categoryStatus(): string {
    return 'وضعیت دسته‌بندی‌ها از ماژول دسته‌بندی';
  }
}
