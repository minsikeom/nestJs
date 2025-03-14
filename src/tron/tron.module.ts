import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TronService } from './tron.service';
import { TronController } from './tron.controller';
import { HttpModule } from '@nestjs/axios';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [ConfigModule,HttpModule,WalletModule],
  controllers: [TronController],
  providers: [TronService],
  exports: [TronService],
})
export class TronModule {}
