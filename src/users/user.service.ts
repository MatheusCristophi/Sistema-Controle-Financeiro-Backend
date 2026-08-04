import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserResponse } from './DTOs/users.response';
import { UserRequest } from './DTOs/users.request';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './users.entity';
import { DataSource, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';

export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly dataSource: DataSource
    ) { }

    async getBalance(userId: string): Promise<string> {

        const user = await this.userRepository.findOneBy({ id: userId });

        
        if (!user) {
            throw new NotFoundException("Usuário não encontrado");
        } else {
            return UserResponse.fromUser(user).balance;
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
            user.password = await bcrypt.hash(userRequest.password, 12);

            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();

            return UserResponse.fromUser(user);
        } catch (error) {
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
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }
}