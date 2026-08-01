import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TransactionRequest } from './DTOs/transaction.request';
import { CurrentUser } from 'src/auth/current.user';
import type { JwtPayload } from 'src/auth/jwtpayload';

@Controller('transactions')
export class TransactionsController {
    constructor(
        private readonly transactionService: TransactionService
    ) { }

    @Post('incomes/:id')
    @UseGuards(AuthGuard)
    IncomeCreate(
        @CurrentUser() user: JwtPayload,
        @Body() transactionRequest: TransactionRequest,
        @Param('id') category: string
    ) {
        return this.transactionService.createIncome(transactionRequest, user.sub, category)
    }

    @Post('expenses/:id')
    @UseGuards(AuthGuard)
    ExpensesCreate(
        @CurrentUser() user: JwtPayload,
        @Body() transactionRequest: TransactionRequest,
        @Param('id') category: string
    ) {
        return this.transactionService.createExpense(transactionRequest, user.sub, category)
    }

    @Get()
    @UseGuards(AuthGuard)
    allTransactions(
        @CurrentUser() user: JwtPayload
    ) {
        return this.transactionService.getAll(user.sub);
    }

    @Put()
    @UseGuards(AuthGuard)
    transactionUpdate(
        @CurrentUser() user: JwtPayload,
        @Body() transactionRequest: TransactionRequest,
        @Query('categoryId') categoryId: string,
        @Query('transactionId') transactionId: string,
    ){
        return this.transactionService.updateTransaction(transactionRequest, transactionId, categoryId, user.sub);
    }

    @Delete()
    @UseGuards()
    transactionDelete(
        @CurrentUser() user:JwtPayload,
        @Param('id') transactionId: string
    ) {
        return this.transactionService.deleteTransaction(transactionId, user.sub);
    }
}
