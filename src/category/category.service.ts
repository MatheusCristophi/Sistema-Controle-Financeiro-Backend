import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm'
import { CategoryEntity } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryResponse } from './DTOs/category.response';
import { CategoryRequest } from './DTOs/category.request';
import { UserEntity } from 'src/users/users.entity';
import { error } from 'console';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
        private readonly dataSource: DataSource,
    ) { }

    async createCategory(categoryRequest: CategoryRequest, curretUserId: string): Promise<CategoryResponse> {

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOneBy(
                UserEntity, { id: curretUserId }
            );

            if (!user) {
                await queryRunner.rollbackTransaction();
                throw new BadRequestException("Erro ao criar a categoria");
            }

            var category = new CategoryEntity();

            category.decription = categoryRequest.description;
            category.createDate = new Date();
            category.user = user;

            await queryRunner.manager.save(category);
            await queryRunner.commitTransaction();

            return CategoryResponse.fromCategory(category);
        } catch {
            await queryRunner.rollbackTransaction();
            if (error instanceof BadRequestException) throw error;
            throw new BadRequestException("Houve um erro ao criar a categoria");
        } finally {
            await queryRunner.release();
        }
    }

    async categoryByName(name: string, curretUserId: string): Promise<CategoryResponse[]> {

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOneBy(UserEntity, {id: curretUserId})

            if (!user) {
                throw new NotFoundException("Usuário não encontrado")
            }

            const category = await queryRunner.manager.findBy(CategoryEntity, { decription: name, user: user }) || [];

            if (!category) {
                await queryRunner.rollbackTransaction();
                throw new NotFoundException("categoria não encontrada");
            }

            if (name.length <= 0) {
                await queryRunner.rollbackTransaction();
                throw new BadRequestException("O Tamanho deve ser maior que 0");
            }
            await queryRunner.commitTransaction();
            return CategoryResponse.fromCategories(category);

        } catch {
            await queryRunner.rollbackTransaction();
            if (error instanceof BadRequestException) throw error
            throw new BadRequestException("Não foi possível buscar as Categorias");
        }
        finally {
            await queryRunner.release();
        }
    }

    async getAllCategories(currentUserId: string): Promise<CategoryResponse[]> {

        const queryRunner = this.dataSource.createQueryRunner();

        queryRunner.connect();
        queryRunner.startTransaction();

        try {
            const allCategories = await queryRunner.manager.find(CategoryEntity);

            allCategories.filter(c => c.user.id === currentUserId);

            if (!allCategories) {
                throw new NotFoundException("Transações não encontradas");
            }

            return CategoryResponse.fromCategories(allCategories);
        } catch {
            await queryRunner.rollbackTransaction();
            if (error instanceof BadRequestException) throw error
            throw new BadRequestException("Não foi possível buscar as transações")
        } finally {
            await queryRunner.release();
        }
    }

    async updateCategory(categoryRequest: CategoryRequest, categoryId: string, curretUserId: string): Promise<CategoryResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const category = await queryRunner.manager.findOneBy(CategoryEntity, { id: categoryId });

            if (!category) {
                await queryRunner.rollbackTransaction();

                throw new NotFoundException("Id não encontrado");
            }

            if (category.user.id !== curretUserId) {
                await queryRunner.rollbackTransaction();

                throw new BadRequestException("Não foi possível criar uma categoria");
            }

            category.decription = categoryRequest.description;
            await queryRunner.manager.save(category);
            await queryRunner.commitTransaction();
            return CategoryResponse.fromCategory(category);
        } catch {
            await queryRunner.rollbackTransaction();
            if (error instanceof BadRequestException) throw error
            throw new BadRequestException("Não foi possível atualizar a Categoria");
        } finally {
            await queryRunner.release();
        }
    }

    async deleteCategory(categoryId: string, curretUserId: string): Promise<void> {

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            var category = await queryRunner.manager.findOneBy(CategoryEntity, { id: categoryId });

            if (!category) {
                await queryRunner.rollbackTransaction();
                throw new NotFoundException("Id não encontrado");
            }

            if (category.user.id !== curretUserId) {
                await queryRunner.rollbackTransaction();
                throw new BadRequestException("Não foi possível criar uma categoria");
            }

            await queryRunner.manager.delete(CategoryEntity, categoryId);
            await queryRunner.commitTransaction();

        } catch {
            await queryRunner.rollbackTransaction();
            if (error instanceof BadRequestException) throw error
            throw new BadRequestException("Não foi possível deletar a categoria");
        } finally {
            await queryRunner.release();
        }
    }
}
