import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current.user';
import type { JwtPayload } from 'src/auth/jwtpayload';
import { CategoryRequest } from './DTOs/category.request';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Post()
    @UseGuards(AuthGuard)
    async categoryCreate(
        @CurrentUser() user:JwtPayload,
        @Body() categoryRequest: CategoryRequest
    ) {
        return this.categoryService.createCategory(categoryRequest, user.sub);
    }

    @Post('name')
    @UseGuards(AuthGuard)
    async getCategoryName(
        @Body('name') name:string,
        @CurrentUser() user:JwtPayload
    ) {
        return this.categoryService.categoryByName(name, user.sub)
    }

    @Get('all')
    @UseGuards(AuthGuard)
    async allCategories(
        @CurrentUser() user:JwtPayload
    ) {
        return this.categoryService.getAllCategories(user.sub);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async categoryUpdate(
        @Body() categoryRequest:CategoryRequest,
        @Param('id') categoryId:string,
        @CurrentUser() user:JwtPayload
    ) {
        return this.categoryService.updateCategory(categoryRequest, categoryId, user.sub);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async categoryDelete(
        @Param('id') categoryId:string,
        @CurrentUser() user:JwtPayload
    ) {
        return this.categoryService.deleteCategory(categoryId, user.sub);
    }
}