import { Body, Controller, Delete, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TransactionRequest } from './DTOs/transaction.request';
import { CurrentUser } from 'src/auth/current.user';
import type { JwtPayload } from 'src/auth/jwtpayload';

@Controller('transactions')
export class TransactionsController {

    constructor(
        private readonly transactionsService:TransactionsService
    ){}

    @Post(':id')
    @UseGuards(AuthGuard)
    @HttpCode(201)
    transactionsCreate(
        @Body() transactionRequest:TransactionRequest,
        @CurrentUser() user: JwtPayload,
        @Param('id') categoryId: string
    ) {
        return this.transactionsService.createTransaction(transactionRequest, user.sub, categoryId);
    }

    @Put(':cid/:tid')
    @UseGuards(AuthGuard)
    @HttpCode(200)
    transactionsUpdate(
        @Body() transactionRequest:TransactionRequest,
        @CurrentUser() user: JwtPayload,
        @Param('cid') categoryId: string,
        @Param('tid') transactionId:string
    ) {
        return this.transactionsService.updateTransaction(user.sub, categoryId, transactionId, transactionRequest, );
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @HttpCode(204)
    transactionDelete(
        @CurrentUser() user:JwtPayload,
        @Param('id') transactionId:string
    ) {
        return this.transactionsService.deleteTransaction(user.sub, transactionId)
    }
}
