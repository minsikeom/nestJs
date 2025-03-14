import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TronWeb } from 'tronweb';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { WalletService } from '../wallet/wallet.service';
import * as cron from 'node-cron';


@Injectable()
export class TronService {
  private tronWeb: InstanceType<typeof TronWeb>
  private readonly apiUrl: string;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly walletService: WalletService
  ) 
  {
    const fullHost      = this.configService.get<string>('TRON_FULL_HOST');
    const solidityNode  = this.configService.get<string>('TRON_SOLIDITY_NODE');
    const eventServer   = this.configService.get<string>('TRON_EVENT_SERVER');
    const apiKey        = this.configService.get<string>('TRON_API_KEY');
    this.apiUrl         = this.configService.get<string>('TRON_API_URL');

    try {
      this.tronWeb = new TronWeb({
        fullHost,
        headers: { 'TRON-PRO-API-KEY': apiKey }, // API 키 추가
        solidityNode,
        eventServer,
      });
      console.log('tronWeb initialized:', !!this.tronWeb);
    } catch (error) {
      console.error('TronWeb Initialization Error:', error);
      throw error;
    }
  }

  // 이상 없음 일단 보류 
  // onModuleInit() {
  //   // 5분마다 작업을 실행하는 Cron 스케줄 설정
  //   cron.schedule('*/5 * * * *', async () => {
  //     console.log('Checking USDT deposits at:', new Date().toISOString());
  //     const userWalletList = await this.walletService.findAll();
  //     // console.log(userWalletList);

  //     if (!userWalletList.length) {
  //       console.log('No wallets found in the database.');
  //       return;
  //     }

  //     for (const wallet of userWalletList) {
  //       const transactions = await this.getTransactionList(wallet.address);
  //       //console.log(transactions);
  //       if (transactions.length === 0) {
  //         continue;
  //       }
  //     }
      
  //   });
  // }

  /**
   * 테더 지갑 생성
   * @returns 
   */
  async generateWallet(): Promise<{ address: string; privateKey: string }> {
    const account = await this.tronWeb.createAccount();
    
    return {
      address: account.address.base58,
      privateKey: account.privateKey,
    };
  }

  /**
   * TRX 잔액 조회
   * @param address 
   * @returns 
   */
  async getTrxBalance(address: string) {
    try {
      const balance = await this.tronWeb.trx.getBalance(address);
      return {
        address,
        trxBalance: this.tronWeb.fromSun(balance), // SUN 단위를 TRX로 변환
      };
    } catch (error) {
      throw new Error(`Failed to get TRX balance: ${error.message}`);
    }
  }

 /**
   * USDT 잔액 조회 (TRC-20)
   * @param address
   * @returns
   */
 async getUsdtBalance(address: string, privateKey: string) {
  try {
    // 각 조회 지갑 privateKey 마다 검색  
    const tronWebs = new TronWeb({
      fullHost: this.configService.get<string>('TRON_FULL_HOST'),
      headers: { 'TRON-PRO-API-KEY': this.configService.get<string>('TRON_API_KEY') },
      privateKey,
    });

    if (!tronWebs.isAddress(address)) {
      throw new Error('Invalid Tron address');
    }

    const contracts = await tronWebs.contract().at(this.configService.get<string>('TRC20_CONTRACT_ADDRESS'));
    const balance = await contracts.balanceOf(address).call({
      from: tronWebs.defaultAddress.base58,
    });

    console.log('USDT Balance Raw:', balance.toString());
    return {
      address,
      usdtBalance: tronWebs.fromSun(balance.toString()),
    };
    
  } catch (error) {
    console.error('USDT Balance Error Details:', error);
    throw new Error(`Failed to get USDT balance: ${error.message}`);
  }
}

/**
 * 거래 내역 조회
 * @param address 
 */
async getTransactionList(address:string){
    try {
      const url = `${this.apiUrl}${address}/transactions/trc20`;
      console.log(url);
      const response = await this.httpService
        .get(url)
        .pipe(map((res) => res.data))
        .toPromise();

      // 데이터가 없으면 중지 
      if (!response.data) {
        return [];
      }

      return response.data
        .filter((tx) => tx.to === address) // 입금 받은 내역만처리
        .map((tx) => ({ 
          txId: tx.transaction_id,
          timestamp: tx.block_timestamp,
          from: tx.from,
          to: tx.to,
          amount: Number(tx.value) / 1000000, // 값 변환
        }));
    
    }  catch (error) {
      console.error('getTransactionList Error:', error);
      throw new Error(`Failed to get getTransactionList: ${error.message}`);
    }

  }

  /**
 * TRX 전송
 * @param fromAddress 
 * @param toAddress
 * @param amount  
 * @param privateKey 
 * @returns
 */
async sendTrx(
  fromAddress: string,
  toAddress: string,
  amount: number,
  privateKey: string,
): Promise<any> { 
  try {
    if (!this.tronWeb.isAddress(fromAddress) || !this.tronWeb.isAddress(toAddress)) {
      throw new Error('Invalid TRON address');
    }

    const amountInSun = this.tronWeb.toSun(amount);
    const amountInSunNumber = typeof amountInSun === 'string' ? parseFloat(amountInSun) : amountInSun.toNumber();
    const transaction = await this.tronWeb.transactionBuilder.sendTrx(
      toAddress,
      amountInSunNumber,
      fromAddress,
    );

    const signedTransaction = await this.tronWeb.trx.sign(transaction, privateKey);
    const result = await this.tronWeb.trx.sendRawTransaction(signedTransaction);

    if (!result.result) {
      throw new Error('Transaction failed');
    }
    console.log('TRX Transaction Result:', result);
    return result;
  } catch (error) {
    console.error('TRX Send Error:', error);
    throw new Error(`Failed to send TRX: ${error.message}`);
  }
}

/**
 * USDT (TRC-20) 전송
 * @param fromAddress 
 * @param toAddress 
 * @param amount 
 * @param privateKey 
 * @returns 
 */
async sendUsdt(
  fromAddress: string,
  toAddress: string, 
  amount: number,
  privateKey: string,
): Promise<any> {
  try {
    // TRC-20 토큰 전송을 위한 스마트 계약 주소
    const usdtContractAddress = this.configService.get<string>('TRC20_CONTRACT_ADDRESS');
    const contract = await this.tronWeb.contract().at(usdtContractAddress);
    
    // TRC-20 토큰 전송 (USDT)
    const amountInSun = this.tronWeb.toSun(amount); // 1 USDT = 1,000,000 Sun
    const amountInSunNumber = typeof amountInSun === 'string' ? parseFloat(amountInSun) : amountInSun.toNumber();
    const transaction = await contract.transfer(toAddress, amountInSunNumber).send({
      feeLimit: 10000000, // trx 수수료 설정
      from: fromAddress,
    });

    // 트랜잭션 결과
    if (!transaction.result) {
      throw new Error('USDT transaction failed');
    }

    console.log('USDT Transaction Result:', transaction);
    return transaction;
  } catch (error) {
    console.error('USDT Send Error:', error);
    throw new Error(`Failed to send USDT: ${error.message}`);
  }
}

/**
 * 트랜잭션 상태 확인
 * @param txId 
 * @returns 
 */
async checkTransactionStatus(txId: string): Promise<any> {
  try {
    const result = await this.tronWeb.trx.getTransactionInfo(txId);
    if (!result) {
      throw new Error(`Transaction failed: ${txId}`);
    }
    return {
      txId,
      status: 'SUCCESS',
    };
  } catch (error) {
    console.error('Transaction Status Error:', error);
    throw new Error(`Failed to check transaction status: ${error.message}`);
  }
}

}
 