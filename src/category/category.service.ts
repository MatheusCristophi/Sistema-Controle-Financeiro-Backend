import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm'
import { CategoryEntity } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryResponse } from './DTOs/category.response';
import { CategoryRequest } from './DTOs/category.request';

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

        var category = new CategoryEntity();

        if (!category) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new NotFoundException("Categoria não encontrada");
        }

        category.decription = categoryRequest.description;
        category.createDate = new Date();

        await queryRunner.manager.save(category);
        await queryRunner.release();

        return CategoryResponse.fromCategory(category);
    }

    async categoryByName(name: string, curretUserId: string): Promise<CategoryResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const category = await this.categoryRepository.findOneBy({ decription: 'name' });

        if (!category) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new NotFoundException("categoria não encontrada");
        }

        return CategoryResponse.fromCategory(category);
    }

    async getAllCategories(): Promise<CategoryResponse[]> {
        const allCategories = await this.categoryRepository.find();

        return CategoryResponse.fromCategories(allCategories);
    }

    async updateCategory(categoryRequest: CategoryRequest, categoryId: string, curretUserId: string): Promise<CategoryResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const category = await this.categoryRepository.findOneBy({ id: categoryId });

        if (!category) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new NotFoundException("Id não encontrado");
        }

        category.decription = categoryRequest.description;
        await queryRunner.manager.save(category);
        await queryRunner.release();
        return CategoryResponse.fromCategory(category);
    }

    async deleteCategory(uuid: string, curretUserId: string): Promise<void> {

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        var category = await this.categoryRepository.findOneBy({ id: uuid });

        if (!category) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new NotFoundException("Id não encontrado");
        }

        this.categoryRepository.delete(uuid);
        await queryRunner.release();
    }
}
