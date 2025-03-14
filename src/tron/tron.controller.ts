import { Controller, Get, Post, Body, Patch, Param, Delete,HttpException, HttpStatus } from '@nestjs/common';
import { TronService } from './tron.service';
import { CreateTronDto } from './dto/create-tron.dto';
import { UpdateTronDto } from './dto/update-tron.dto';
import { SearchTronDto } from './dto/search-tron.dto ';

@Controller('tron')
export class TronController {
  constructor(private readonly tronService: TronService) {}
  
  /**
   * 테더 지갑 생성
   * @returns 
   */
  @Post('generate-wallet')
  async generateWallet() {
    try {
      return await this.tronService.generateWallet();
    } catch (error) {
      console.error('Generate Wallet Error:', error); // 에러 로그 출력
      throw new HttpException(error.message || 'Failed to generate wallet', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * TRX 잔고 조회
   * @param address 
   * @returns 
   */
  @Get('balance/trx/:address')
  async getTrxBalance(@Param('address') address: string){
    try {
      return await this.tronService.getTrxBalance(address);
    } catch (error) {
      console.error('Get TRX Balance Error:', error);
      throw new HttpException(error.message || 'Failed to get TRX balance', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Tether 잔고 조회
   * @param dto 
   * @returns 
   */
  @Post('balance/tether')
  async getTetherBalance(@Body() dto:SearchTronDto){
    try {
      return await this.tronService.getUsdtBalance(dto.address, dto.privateKey);
    } catch (error) {
      console.error('Get tether Balance Error:', error);
      throw new HttpException(error.message || 'Failed to get tether balance', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('tether/transactionList/:address')
  async getTransactionList(@Param('address') address:string){
    try {
      return await this.tronService.getTransactionList(address);
    } catch (error) {
      console.error('Get getTransactionList Error:', error);
      throw new HttpException(error.message || 'Failed to get getTransactionList', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }





}
