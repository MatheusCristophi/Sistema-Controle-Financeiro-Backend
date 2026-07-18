import { DataSource, Repository } from 'typeorm'
import { UserEntity } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRequest } from './DTOs/users.request';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserResponse } from './DTOs/users.response';
import { error } from 'console';

export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly dataSource: DataSource
    ) { }

    async updateUser(userRequest: UserRequest, currentUserId: string): Promise<UserResponse> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOneBy(UserEntity, { id: currentUserId });
            if (!user) {
                await queryRunner.rollbackTransaction();
                throw new BadRequestException("Não foi possível alterar os dados do usuário");
            }

            if (user.id !== currentUserId) {
                await queryRunner.rollbackTransaction();
                throw new NotFoundException("Não foi possível alterar os dados do usuário");
            }

            user.name = userRequest.name;
            user.email = userRequest.email;
            user.password = userRequest.password;

            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();

            return UserResponse.fromUser(user);
        } catch {
            await queryRunner.rollbackTransaction();
            if (error instanceof error) throw error
            throw new BadRequestException("Houve um erro ao alterar os dados do usuário");
        } finally {
            queryRunner.release();
        }
    }

    async deleteUser(currentUserId: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOneBy(UserEntity, { id: currentUserId });

            if (!user) {
                await queryRunner.rollbackTransaction();
                throw new BadRequestException("Erro ao deletar Usuário");
            }

            if (user.id !== currentUserId) {
                await queryRunner.rollbackTransaction();
                throw new BadRequestException("Erro ao deletar Usuário");
            }

            await queryRunner.manager.delete(UserEntity, { id: currentUserId });
            queryRunner.commitTransaction();
        } catch {
            queryRunner.rollbackTransaction();
            if (error instanceof BadRequestException) throw error
            throw new BadRequestException("Erro ao deletar Usuário");
        }
    }
}