import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class PaymentResolver {
  @Query(() => String, { name: 'paymentStatus' })
  paymentStatus(): string {
    return 'وضعیت پرداخت‌ها از ماژول پرداخت‌ها';
  }
}
