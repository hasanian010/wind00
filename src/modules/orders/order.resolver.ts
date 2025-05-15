import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class OrderResolver {
  @Query(() => String, { name: 'orderStatus' })
  orderStatus(): string {
    return 'وضعیت سفارشات از ماژول سفارشات';
  }
}
