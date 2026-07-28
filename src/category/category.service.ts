import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DataSource, ILike, Like } from 'typeorm'
import { CategoryEntity } from './category.entity';
import { CategoryResponse } from './DTOs/category.response';
import { CategoryRequest } from './DTOs/category.request';
import { UserEntity } from 'src/users/users.entity';

@Injectable()
export class CategoryService {

    constructor(
        private readonly dataSource: DataSource,
    ) { }

    async createCategory(categoryRequest: CategoryRequest, curretUserId: string): Promise<CategoryResponse> {

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOne(
                UserEntity, { 
                    where:{
                        id: curretUserId
                    }
                }
            );

            if (!user) {
                throw new BadRequestException("Erro ao criar a categoria");
            }

            var category = new CategoryEntity();

            category.description = categoryRequest.description;
            category.createDate = new Date();
            category.transactions = [];
            category.user = user;

            await queryRunner.manager.save(category);
            await queryRunner.commitTransaction();

            return CategoryResponse.fromCategory(category);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async categoryByName(name: string, curretUserId: string): Promise<CategoryResponse[]> {
        
        if (name.length <= 0) {
            throw new BadRequestException("O Tamanho deve ser maior que 0");
        }

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOne(UserEntity, {
                where: {
                    id: curretUserId
                },
                relations: {
                    category: true
                }
            })

            if (!user) {
                throw new NotFoundException("Usuário não encontrado")
            }

            
            const categoryWithName = await queryRunner.manager.findBy(CategoryEntity, {
                description: ILike(`%${name}%`),
                user: {
                    id: user.id
                }
            });

            await queryRunner.commitTransaction();
            return CategoryResponse.fromCategories(categoryWithName);

        } catch(error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }

    async getAllCategories(currentUserId: string): Promise<CategoryResponse[]> {

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOne(UserEntity, {
                where: {
                    id: currentUserId
                },
                relations: {
                    category: true
                }
            });

            if(!user) {
                throw new UnauthorizedException("Não foi possível buscar o usuário");
            }

            if (!user.category) {
                throw new NotFoundException("Transações não encontradas");
            }

            return CategoryResponse.fromCategories(user.category);
        } catch(error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async updateCategory(categoryRequest: CategoryRequest, categoryId: string, curretUserId: string): Promise<CategoryResponse> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const category = await queryRunner.manager.findOne(CategoryEntity, {
                where: {
                    id: categoryId
                },
                relations: {
                    user: true
                } 
            });

            if (!category) {
                throw new NotFoundException("Id não encontrado");
            }

            if (category.user.id !== curretUserId) {
                throw new BadRequestException("Não foi possível criar uma categoria");
            }

            category.description = categoryRequest.description;
            await queryRunner.manager.save(category);
            await queryRunner.commitTransaction();
            return CategoryResponse.fromCategory(category);
        } catch(error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async deleteCategory(categoryId: string, curretUserId: string): Promise<void> {

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            var category = await queryRunner.manager.findOne(CategoryEntity, {
                where:{
                    id: categoryId
                },
                relations: {
                    user: true
                }
            });

            if (!category) {
                throw new NotFoundException("Id não encontrado");
            }

            if (category.user.id !== curretUserId) {
                throw new UnauthorizedException("Não foi possível deletar a categoria");
            }

            await queryRunner.manager.delete(CategoryEntity, categoryId);
            await queryRunner.commitTransaction();

        } catch(error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
