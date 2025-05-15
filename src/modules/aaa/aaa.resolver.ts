import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AaaResolver {
  @Query(() => String, { name: 'testAaa' })
  testAaa(): string {
    return 'ماژول تست aaa با مسیر مستعار';
  }
}
