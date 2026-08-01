import { Controller } from '@nestjs/common';
import { TransactionService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
    constructor(
        private readonly transactionService:TransactionService
    ){}


    

}
