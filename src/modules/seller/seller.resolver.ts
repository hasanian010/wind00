import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class SellerResolver {
  @Query(() => String, { name: 'sellerStatus' })
  sellerStatus(): string {
    return 'وضعیت فروشندگان از ماژول فروشندگان';
  }
}
