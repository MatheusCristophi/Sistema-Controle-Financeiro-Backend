import Decimal from "decimal.js";
import { PaymentMethod, TransactionType } from "src/enum/enums";
import { TransactionEntity } from "src/transactions/transaction.entity";

export class DashboardResponse {
    type:TransactionType;
    date:Date;
    value:Decimal;
    userName:string;
    category:string;
    description:string;
    paymentForm:PaymentMethod;

    static toDashboard(transaction:TransactionEntity): DashboardResponse {
        return {
            type:transaction.type,
            date:transaction.transactionDate,
            value:Decimal(transaction.value),
            userName:transaction.user.name,
            category:transaction.category.description,
            description:transaction.description,
            paymentForm:transaction.paymentMethod
        }
    }

    static toDashboards(
        transactions:TransactionEntity[]
    ): DashboardResponse[] {
        return transactions.map(DashboardResponse.toDashboard)
    }
}