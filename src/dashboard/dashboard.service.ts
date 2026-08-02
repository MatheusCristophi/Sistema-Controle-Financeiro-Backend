import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpensesEntity } from 'src/transactions/expense.entity';
import { IncomeEntity } from 'src/transactions/income.entity';
import { Between, Repository } from 'typeorm'

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(IncomeEntity)
        private readonly incomeRepository: Repository<IncomeEntity>,
        @InjectRepository(ExpensesEntity)
        private readonly expensesRepository: Repository<ExpensesEntity>,
    ) { }

    async getIncomesBalance(userId: string) {
        const allIncomesValue = await this.incomeRepository.sum('value', {
            user: {
                id: userId
            },
        });

        return allIncomesValue;
    }

    async getExpensesBalance(userId: string) {
        const allExpensesValue = await this.expensesRepository.sum('value', {
            user: {
                id: userId
            }
        })

        return allExpensesValue;
    }

    async getAllIncomesForMonth(userId: string) {
        const dateNow = new Date()
        const year = dateNow.getFullYear();
        const month = dateNow.getMonth();

        const firstDay = new Date(year, month, 1, 0, 0);
        const lastDay = new Date(year, month + 1, 0, 23, 59);

        const allIncomes = await this.incomeRepository.find({
            where: {
                user: {
                    id: userId
                },
                transactionDate: Between(firstDay, lastDay)
            },
            order: {
                transactionDate: 'ASC'
            }
        });
        return allIncomes;
    }

    async getAllExpensesForMonth(userId: string) {
        const dateNow = new Date()
        const year = dateNow.getFullYear();
        const month = dateNow.getMonth();

        const firstDay = new Date(year, month, 1, 0, 0);
        const lastDay = new Date(year, month + 1, 0, 23, 59);

        const allExpenses = await this.expensesRepository.find({
            where: {
                user: {
                    id: userId
                },
                transactionDate: Between(firstDay, lastDay)
            },
            order: {
                transactionDate: 'ASC'
            }
        });
        return allExpenses;
    }
}