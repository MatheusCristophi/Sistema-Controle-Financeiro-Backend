import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ConfigService } from '@nestjs/config';
import { TransactionEntity } from 'src/transactions/transaction.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionEntity]),
    ],
    controllers: [DashboardController],
    providers: [DashboardService, ConfigService],
})
export class DashboardModule {}
