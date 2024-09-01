import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity'; 

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRoot({
    type: 'mysql',
      host: 'host.docker.internal',
      port: +process.env.DATABASE_PORT,
      username: 'root',
      password: 'rootpassword',
      database: 'test',
      entities: [User],
    synchronize: false,
  }),
  UserModule,
  ],
  controllers: [],
  providers: [],

})
export class AppModule {}
