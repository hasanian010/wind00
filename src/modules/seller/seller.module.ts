import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerResolver } from './seller.resolver';

@Module({
  providers: [SellerService, SellerResolver],
})
export class SellerModule {}
