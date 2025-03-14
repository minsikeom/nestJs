import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Wallet extends Document {
  @Prop({ required: true, unique: true })
  address: string;
  
  @Prop({ required: true })
  private_key: string;

  @Prop({ required: true })
  user_id: number;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 0 })
  total_deposit_balance: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);