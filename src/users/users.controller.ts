import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
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
    async currentBalance(@CurrentUser() user:JwtPayload) {
        return this.userService.getBalance(user.sub);
    }

    @Put()
    @UseGuards(AuthGuard)
    async userUpdate(
        @CurrentUser() user:JwtPayload,
        @Body() userRequest:UserRequest
    ) {
        return this.userService.updateUser(userRequest, user.sub)
    }

    @Delete()
    @UseGuards(AuthGuard)
    async userDelete(
        @CurrentUser() user:JwtPayload
    ) {
        return this.userService.deleteUser(user.sub);
    }
}
