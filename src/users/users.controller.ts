import { Body, Controller, Delete, Get, HttpCode, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current.user';
import type { JwtPayload } from 'src/auth/jwtpayload';
import { UserRequest } from './DTOs/users.request';

@Controller('users')
export class UsersController {

    constructor (
        private readonly userService: UserService
    ){}

    @Get()
    @UseGuards(AuthGuard)
    @HttpCode(200)
    async currentBalance(@CurrentUser() user:JwtPayload) {
        return this.userService.getBalance(user.sub);
    }

    @Put()
    @UseGuards(AuthGuard)
    @HttpCode(200)
    async userUpdate(
        @CurrentUser() user:JwtPayload,
        @Body() userRequest:UserRequest
    ) {
        return this.userService.updateUser(userRequest, user.sub)
    }

    @Delete()
    @UseGuards(AuthGuard)
    @HttpCode(204)
    async userDelete(
        @CurrentUser() user:JwtPayload
    ) {
        return this.userService.deleteUser(user.sub);
    }
}
