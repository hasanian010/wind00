import { Module } from '@nestjs/common';
import { FlashService } from './flash.service';
import { FlashResolver } from './flash.resolver';

@Module({
  providers: [FlashService, FlashResolver],
})
export class FlashModule {}
