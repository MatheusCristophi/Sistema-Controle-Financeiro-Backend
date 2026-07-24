import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm'
import { TransactionEntity } from './transaction.entity';
import { TransactionResponse } from './DTOs/transaction.response';
import { UserEntity } from 'src/users/users.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TransactionRequest } from './DTOs/transaction.request';
import { CategoryEntity } from 'src/category/category.entity';
import { IncomeEntity } from './income.entity';
import { ExpensesEntity } from './expense.entity';

export class TransactionService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly dataSource: DataSource
    ) { }

    async createIncome(transactionRequest: TransactionRequest, userId: string, categoryId:string): Promise<TransactionResponse> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOneBy(UserEntity, { id: userId });

            const category = await queryRunner.manager.findOneBy(CategoryEntity, {id: categoryId});

            if (!user) {
                throw new UnauthorizedException("Não foi possível buscar o usuário")
            }

            if (!category) {
                throw new NotFoundException("Não foi possível buscar a categoria")
            }

            const transaction:IncomeEntity = new IncomeEntity();
            transaction.user = user;
            transaction.description = transactionRequest.description;
            transaction.value = transactionRequest.value;
            transaction.category = category;
            transaction.paymentMethod = transactionRequest.paymentMethod

            user.balance = Number(user.balance) + Number(transaction.value);

            await queryRunner.manager.save(transaction);
            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
            return TransactionResponse.fromTransaction(transaction);
        } catch(error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async createExpense(transactionRequest: TransactionRequest, userId: string, categoryId:string): Promise<TransactionResponse> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOneBy(UserEntity, { id: userId });

            const category = await queryRunner.manager.findOneBy(CategoryEntity, {id: categoryId});

            if (!user) {
                throw new UnauthorizedException("Não foi possível buscar o usuário")
            }

            if (!category) {
                throw new NotFoundException("Não foi possível buscar a categoria")
            }

            const transaction:ExpensesEntity = new ExpensesEntity();
            transaction.user = user;
            transaction.description = transactionRequest.description;
            transaction.value = transactionRequest.value;
            transaction.category = category;
            transaction.paymentMethod = transactionRequest.paymentMethod

            user.balance = Number(user.balance) - Number(transaction.value);

            await queryRunner.manager.save(transaction);
            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
            return TransactionResponse.fromTransaction(transaction);
        } catch(error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async getAll(currentUserId: string): Promise<TransactionResponse[]> {

        const user = await this.userRepository.findOne({
            where: {
                id: currentUserId
            },

            relations: {
                transactions: true
            },
        });

        if (!user) {
            throw new NotFoundException("Suas transações não foram encontradas")
        }

        return TransactionResponse.fromTransactions(user.transactions);
    }

    async updateTransaction(transactionRequest: TransactionRequest, transactionId: string, categoryId:string, userId: string): Promise<TransactionResponse>{
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            const user = await queryRunner.manager.findOneBy(UserEntity, {id: userId});
            const transaction = await queryRunner.manager.findOneBy(TransactionEntity, {id:transactionId});

            if (!user) {
                throw new NotFoundException("Usuário não encontrado")
            }

            const category = await queryRunner.manager.findOneBy(CategoryEntity, { id: categoryId, user: user});

            if (!transaction || !category) {
                throw new NotFoundException("Não foi possível buscar a transação");
            }

            transaction.description = transactionRequest.description;
            transaction.value = transactionRequest.value;
            transaction.category = category;
            transaction.paymentMethod = transactionRequest.paymentMethod

            await queryRunner.manager.save(transaction);
            await queryRunner.commitTransaction();
            return TransactionResponse.fromTransaction(transaction);

        } catch(error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async deleteTransaction(transactionId:string, userId:string):Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOneBy(UserEntity, {id: userId});
            
            if (!user) {
                throw new NotFoundException("Não foi possível encontrar o usuário");
            }

            const transaction = await queryRunner.manager.findOneBy(TransactionEntity, {id: transactionId, user: user});

            if(!transaction) {
                throw new NotFoundException("Não foi possível buscar a transação");
            }

            await queryRunner.manager.delete(TransactionEntity, {id:transactionId})
            await queryRunner.commitTransaction();
        } catch(error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}