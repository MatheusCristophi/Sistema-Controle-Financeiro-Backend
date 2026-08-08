import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm'
import { DashboardResponse } from './DTOs/dashboard.response';
import { TransactionType } from 'src/enum/enums';
import { TransactionEntity } from 'src/transactions/transaction.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly transactionRepository: Repository<TransactionEntity>,
    ) { }

    async getIncomesBalance(userId: string) {
        const allIncomesValue = await this.transactionRepository.sum('value', {
            type: TransactionType.INCOMES,
            user: {
                id: userId
            },
        });

        if(!allIncomesValue) return 0;

        return allIncomesValue;
    }

    async getExpensesBalance(userId: string) {
        const allExpensesValue = await this.transactionRepository.sum('value', {
            type: TransactionType.EXPENSES,
            user: {
                id: userId
            }
        })

        if(!allExpensesValue) return 0;

        return allExpensesValue;
    }

    async getAllIncomesForMonth(userId: string) {
        const dateNow = new Date()
        const year = dateNow.getFullYear();
        const month = dateNow.getMonth();

        const firstDay = new Date(year, month, 1, 0, 0);
        const lastDay = new Date(year, month + 1, 0, 23, 59);

        const allIncomes = await this.transactionRepository.find({
            where: {
                type: TransactionType.INCOMES,
                user: {
                    id: userId
                },
                transactionDate: Between(firstDay, lastDay)
            },
            order: {
                transactionDate: 'ASC'
            }
        });
        return DashboardResponse.toDashboards(allIncomes);
    }

    async getAllExpensesForMonth(userId: string) {
        const dateNow = new Date()
        const year = dateNow.getFullYear();
        const month = dateNow.getMonth();

        const firstDay = new Date(year, month, 1, 0, 0);
        const lastDay = new Date(year, month + 1, 0, 23, 59);

        const allExpenses = await this.transactionRepository.find({
            where: {
                type: TransactionType.EXPENSES,
                user: {
                    id: userId
                },
                transactionDate: Between(firstDay, lastDay)
            },
            order: {
                transactionDate: 'ASC'
            }
        });
        return DashboardResponse.toDashboards(allExpenses);
    }
}