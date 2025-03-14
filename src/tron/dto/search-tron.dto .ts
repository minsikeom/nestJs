import { IsString, IsNumber } from 'class-validator';

export class SearchTronDto {
     @IsString()
        address: string;
    @IsString()
        privateKey: string;
}
