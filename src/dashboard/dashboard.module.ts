import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ConfigService } from '@nestjs/config';
import { IncomeEntity } from 'src/transactions/income.entity';
import { ExpensesEntity } from 'src/transactions/expense.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([IncomeEntity, ExpensesEntity]),
    ],
    controllers: [DashboardController],
    providers: [DashboardService, ConfigService],
})
export class DashboardModule {}
