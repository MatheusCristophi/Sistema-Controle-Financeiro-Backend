import { DataSource } from 'typeorm'
import { UserEntity } from './users.entity';
import { UserRequest } from './DTOs/users.request';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserResponse } from './DTOs/users.response';

export class UserService {

    constructor(
        private readonly dataSource: DataSource
    ) { }

    async getBalance(userId:string):Promise<number> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOneBy(UserEntity, {id: userId});

            if(!user) {
                throw new UnauthorizedException("Não foi possível buscar o usuário");
            }

            await queryRunner.commitTransaction();
            return Number(user.balance);
            
        } catch(error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async updateUser(userRequest: UserRequest, currentUserId: string): Promise<UserResponse> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOneBy(UserEntity, { id: currentUserId });
            if (!user) {
                throw new BadRequestException("Não foi possível alterar os dados do usuário");
            }

            user.name = userRequest.name;
            user.email = userRequest.email;
            user.password = userRequest.password;

            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();

            return UserResponse.fromUser(user);
        } catch(error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async deleteUser(currentUserId: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOneBy(UserEntity, { id: currentUserId });

            if (!user) {
                throw new BadRequestException("Erro ao deletar Usuário");
            }

            await queryRunner.manager.delete(UserEntity, { id: currentUserId });
            await queryRunner.commitTransaction();
        } catch(error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }
}