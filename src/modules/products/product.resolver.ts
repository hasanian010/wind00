import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class ProductResolver {
  @Query(() => String, { name: 'productStatus' })
  productStatus(): string {
    return 'وضعیت محصولات از ماژول محصولات';
  }
}
