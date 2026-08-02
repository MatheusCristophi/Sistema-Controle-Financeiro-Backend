import { IsDecimal, IsEnum, IsString, Length } from "class-validator";
import { PaymentMethod } from "src/enum/payment.method";

export class TransactionRequest {
    @Length(6,50, {message: "O nome deve ter entre 6 e 50 caracteres"})
    description:string;

    @IsDecimal({}, {message:'O Valor deve ser um número'})
    value:number;

    @IsString({message: 'Id Não encontrado'})
    categoryId:string;

    @IsEnum(PaymentMethod, {message:'Enum inválido'})
    paymentMethod:PaymentMethod;
}