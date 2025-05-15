import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserResolver } from './modules/users/user.resolver';
import { ProductModule } from './modules/products/product.module';
import { OrderModule } from './modules/orders/order.module';
import { PaymentModule } from './modules/payments/payment.module';
import { AaaModule } from '@/modules/aaa/aaa.module';
import { BrandModule } from './modules/brand/brand.module';
import { TagModule } from './modules/tag/tag.module';
import { CategoryModule } from './modules/category/category.module';
import { SellerModule } from './modules/seller/seller.module';
import { FlashModule } from './modules/flash/flash.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
    }),
    ProductModule,
    OrderModule,
    PaymentModule,
    AaaModule,
    BrandModule,
    TagModule,
    CategoryModule,
    SellerModule,
    FlashModule,
  ],
  controllers: [AppController],
  providers: [UserResolver],
})
export class AppModule {}
