import { Module } from '@nestjs/common';
import { AaaResolver } from './aaa.resolver';
import { AaaService } from '@/modules/aaa/aaa.service';

@Module({
  providers: [AaaResolver, AaaService],
})
export class AaaModule {}
