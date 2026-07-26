import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type:'postgres',
      host:process.env.DB_HOST,
      port:Number(process.env.DB_PORT),
      username:process.env.DB_USERNAME,
      password:process.env.DB_PASSWORD,
      database:process.env.DB_DATABASE,
      logging: true,
      synchronize:true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    UsersModule,
    TransactionsModule,
    CategoryModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
