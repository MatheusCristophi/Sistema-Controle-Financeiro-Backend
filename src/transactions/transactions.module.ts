import { Module } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { UserEntity } from 'src/users/users.entity';
import { TransactionsController } from './transactions.controller';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionEntity, UserEntity])
    ],
    controllers: [TransactionsController],
    providers: [TransactionService, ConfigService,],
})
export class TransactionsModule {}
