import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';

config();
// const dotenv = require('dotenv');
// dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST_TEST,
      port: parseInt(process.env.DB_PORT_TEST, 10) || 3306,
      username: process.env.DB_USERNAME_TEST,
      password: process.env.DB_PASSWORD_TEST,
      database: process.env.DB_NAME_TEST,
      entities: [User],
      synchronize: true,
    }),

    UserModule,
  ],
})
export class TestModule {}
