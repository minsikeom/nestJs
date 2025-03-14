import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity'; 
import { WalletModule } from './wallet/wallet.module';
import { TronModule } from './tron/tron.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
    cache: false,
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      type: 'mysql' as const,
      host: configService.get<string>('DATABASE_HOST'),
      port: +configService.get<string>('DATABASE_PORT'),
      username: configService.get<string>('DATABASE_USERNAME'),
      password: configService.get<string>('DATABASE_PASSWORD'),
      database: configService.get<string>('DATABASE_NAME'),
      entities: [User],
      synchronize: false, // 프로덕션에서는 false로 유지 -> 테이블 자동생성 옵션 
    }),
    inject: [ConfigService],
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('MONGO_URI'), // MongoDB 연결 URI
    }),
    inject: [ConfigService],
  }),
  UserModule,WalletModule, TronModule
  ],
  controllers: [],
  providers: [],

})
export class AppModule {}
