import { Controller, Get, UseGuards } from '@nestjs/common';
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
    incomeBalance(
        @CurrentUser() user: JwtPayload
    ) {
        return this.dashboardService.getIncomesBalance(user.sub);
    }

    @Get('expense')
    @UseGuards(AuthGuard)
    exepenseBalance(
        @CurrentUser() user: JwtPayload
    ) {
        return this.dashboardService.getExpensesBalance(user.sub);
    }

    @Get('allincomes')
    @UseGuards(AuthGuard)
    allIncomesForMonth(
        @CurrentUser() user: JwtPayload
    ) {
        return this.dashboardService.getAllIncomesForMonth(user.sub);
    }

    @Get('allexpenses')
    @UseGuards(AuthGuard)
    allExpensesForMonth(
        @CurrentUser() user: JwtPayload
    ) {
        return this.dashboardService.getAllExpensesForMonth(user.sub);
    }
}
