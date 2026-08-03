import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { TransactionRequest } from './DTOs/transaction.request';
import { Decimal } from 'decimal.js';
import { UserEntity } from 'src/users/users.entity';
import { CategoryEntity } from 'src/category/category.entity';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly transactionRepository: Repository<TransactionEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly dataSource: DataSource,
    ) { }

    async createTransaction(transactionRequest: TransactionRequest, userId: string, categoryId: string) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOne(UserEntity, {
                where: {
                    id: userId,
                }
            });

            if (!user) {
                throw new NotFoundException('Erro ao buscar o usuário');
            }

            const category = await queryRunner.manager.findOneBy(CategoryEntity, { id: categoryId });

            if (!category) {
                throw new NotFoundException('Categoria Inválida');
            }

            const transaction = new TransactionEntity();

            if (transactionRequest.type === 'Expenses') {
                const value = new Decimal(transactionRequest.value);
                const userBalance = new Decimal(user.balance);
                user.balance = userBalance.minus(value).toString();
            }

            if (transactionRequest.type === 'Incomes') {
                const value = new Decimal(transactionRequest.value);
                const userBalance = new Decimal(user.balance);
                user.balance = userBalance.plus(value).toString();
            }

            transaction.description = transactionRequest.description;
            transaction.user = user;
            transaction.category = category;
            transaction.paymentMethod = transactionRequest.paymentMethod;
            transaction.value = transactionRequest.value;
            transaction.type = transactionRequest.type

            await queryRunner.manager.save(user);
            await queryRunner.manager.save(transaction);
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async updateTransaction(userId: string, categoryId: string, transactionId: string, transactionRequest: TransactionRequest) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOne(UserEntity, {
                where: {
                    id: userId
                }
            })

            if (!user) {
                throw new NotFoundException('Erro ao buscar o Usuário');
            }

            const category = await queryRunner.manager.findOne(CategoryEntity, {
                where: {
                    id: categoryId
                }
            })

            if (!category) {
                throw new NotFoundException('Erro ao buscar a categoria');
            }

            const transaction = await queryRunner.manager.findOne(TransactionEntity, {
                where: {
                    id: transactionId
                },
                relations: {
                    user: true
                }
            })

            if (!transaction || transaction.user.id !== user.id) {
                throw new NotFoundException('Erro ao buscar a Transação');
            }
            
            if (transaction.type === 'Expenses') {
                user.balance = Decimal(user.balance).plus(transaction.value).toString();
            } else {
                user.balance = Decimal(user.balance).minus(transaction.value).toString();
            }

            transaction.description = transactionRequest.description;
            transaction.category = category;
            transaction.paymentMethod = transactionRequest.paymentMethod;
            transaction.type = transactionRequest.type;
            transaction.value = transactionRequest.value;

            if (transaction.type === 'Incomes') {
                user.balance = Decimal(user.balance).plus(transaction.value).toString();
            } else {
                user.balance = Decimal(user.balance).minus(transaction.value).toString();
            }

            await queryRunner.manager.save(transaction);
            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async deleteTransaction(userId: string, transactionId: string) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOneBy(UserEntity, { id: userId });

            if (!user) {
                throw new NotFoundException('Transação não encontrada');
            }

            const transaction = await queryRunner.manager.findOne(TransactionEntity, {
                where: {
                    id: transactionId
                },
                relations: {
                    user: true
                }
            });

            if (!transaction || transaction.user.id !== user.id) {
                throw new NotFoundException('Transação não encontrada');
            }

            if (transaction.type === 'Incomes') {
                user.balance = Decimal(user.balance).minus(transaction.value).toString();
            } else {
                user.balance = Decimal(user.balance).plus(transaction.value).toString();
            }

            await queryRunner.manager.delete(TransactionEntity, { id: transaction.id });
            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}