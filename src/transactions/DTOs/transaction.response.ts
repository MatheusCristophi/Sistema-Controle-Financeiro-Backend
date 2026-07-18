import { PaymentMethod } from "src/enum/payment.method";
import { Status } from "src/enum/status.enum";
import { TransactionEntity } from "../transaction.entity";

export class TransactionResponse {

    description: string;

    value: number;

    categoryId: string;

    status: Status;

    paymentMethod: PaymentMethod;

    static fromTransaction(
        transaction: TransactionEntity
    ): TransactionResponse {
        return {
            description: transaction.description,
            value: transaction.value,
            categoryId: transaction.category.id,
            status: transaction.status,
            paymentMethod: transaction.paymentMethod
        }
    }

    static fromTransactions(
        transactions:TransactionEntity[]
    ): TransactionResponse[] {
        return transactions.map(TransactionResponse.fromTransaction);
    }
}