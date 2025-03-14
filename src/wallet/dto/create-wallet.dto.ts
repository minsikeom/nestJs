import { IsString, IsNumber } from 'class-validator';

export class CreateWalletDto {
    @IsString()
    address: string;
    @IsString()
    private_key: string;
    @IsNumber()
    user_id:number;  
    @IsNumber()
    balance:number;
    @IsNumber()
    total_deposit_balance:number;
}
