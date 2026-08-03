import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { UserEntity } from 'src/users/users.entity';
import { ConfigService } from '@nestjs/config';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionEntity, UserEntity])
    ],
    controllers: [TransactionsController],
    providers: [TransactionsService, ConfigService, TransactionsService,],
})
export class TransactionsModule {}
