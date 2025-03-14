import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(@Body() createWalletDto: any) {
    return this.walletService.create(createWalletDto);
  }

  @Get()
  findAll() {
    return this.walletService.findAll();
  }

  @Get(':address')
  findOne(@Param('address') address: string) {
    return this.walletService.findOne(address);
  }

  @Put(':address')
  update(@Param('address') address: string, @Body() updateWalletDto: any) {
    return this.walletService.update(address, updateWalletDto);
  }

  @Delete(':address')
  remove(@Param('address') address: string) {
    return this.walletService.remove(address);
  }
}