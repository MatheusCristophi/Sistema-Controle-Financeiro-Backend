import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm'
import { TransactionEntity } from './transaction.entity';
import { TransactionResponse } from './DTOs/transaction.response';
import { UserEntity } from 'src/users/users.entity';
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TransactionRequest } from './DTOs/transaction.request';
import { CategoryEntity } from 'src/category/category.entity';

export class TransactionService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly dataSource: DataSource
    ) { }

    async createTransaction(transactionRequest: TransactionRequest, userId: string, categoryId:string): Promise<TransactionResponse> {
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

            const transaction:TransactionEntity = new TransactionEntity();
            transaction.user = user;
            transaction.description = transactionRequest.description;
            transaction.value = transactionRequest.value;
            transaction.category = category;
            transaction.status = transactionRequest.status;
            transaction.paymentMethod = transactionRequest.paymentMethod

            await queryRunner.manager.save(transaction);
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
            }
        });

        if (!user) {
            throw new NotFoundException("Suas transações não foram encontradas")
        }

        const transactions: TransactionEntity[] = user.transactions || [];

        return TransactionResponse.fromTransactions(transactions);
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
            transaction.status = transactionRequest.status;
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