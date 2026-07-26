import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {

    constructor (
        private readonly userService: UserService
    ){}

    @Get(':id')
    async currentBalance(@Param('id') id: string) {
        return this.userService.getBalance(id);
    }

}
