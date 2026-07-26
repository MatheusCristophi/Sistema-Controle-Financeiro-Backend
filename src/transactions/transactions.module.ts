import { Module } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { UserEntity } from 'src/users/users.entity';
import { TransactionsController } from './transactions.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionEntity, UserEntity])
    ],
    providers: [TransactionService],
    controllers: [TransactionsController]
})
export class TransactionsModule {}
