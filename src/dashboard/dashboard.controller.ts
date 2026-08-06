import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from 'src/auth/current.user';
import type { JwtPayload } from 'src/auth/jwtpayload';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('dashboard')
export class DashboardController {
    constructor (
        private readonly dashboardService:DashboardService
    ){}

    @Get('income')
    @UseGuards(AuthGuard)
    @HttpCode(200)
    incomeBalance(
        @CurrentUser() user: JwtPayload
    ) {
        return this.dashboardService.getIncomesBalance(user.sub);
    }

    @Get('expense')
    @UseGuards(AuthGuard)
    @HttpCode(200)
    exepenseBalance(
        @CurrentUser() user: JwtPayload
    ) {
        return this.dashboardService.getExpensesBalance(user.sub);
    }

    @Get('allincomes')
    @UseGuards(AuthGuard)
    @HttpCode(200)
    allIncomesForMonth(
        @CurrentUser() user: JwtPayload
    ) {
        return this.dashboardService.getAllIncomesForMonth(user.sub);
    }

    @Get('allexpenses')
    @UseGuards(AuthGuard)
    @HttpCode(200)
    allExpensesForMonth(
        @CurrentUser() user: JwtPayload
    ) {
        return this.dashboardService.getAllExpensesForMonth(user.sub);
    }
}
