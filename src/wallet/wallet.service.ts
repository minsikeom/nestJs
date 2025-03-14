import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from './entities/wallet.schema';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WalletService {
  constructor(@InjectModel(Wallet.name) private walletModel: Model<Wallet>) {}

  async create(createWalletDto: CreateWalletDto): Promise<Wallet> {
    const newWallet = new this.walletModel(createWalletDto);
    return newWallet.save();
  }

  async findAll(): Promise<Wallet[]> {
    return this.walletModel.find().exec();
  }

  async findOne(address: string): Promise<Wallet> {
    return this.walletModel.findById(address).exec();
  }

  async update(address: string, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    return this.walletModel.findByIdAndUpdate(address, updateWalletDto, { new: true }).exec();
  }

  async remove(address: string): Promise<void> {
    await this.walletModel.findByIdAndDelete(address).exec();
  }
}