import { IsDecimal, IsEnum, IsString, Length } from "class-validator";
import { PaymentMethod, TransactionType } from "src/enum/enums";

export class TransactionRequest {
    @Length(6,50, {message: "O nome deve ter entre 6 e 50 caracteres"})
    description:string;

    @IsDecimal({}, {message:'O Valor deve ser um número'})
    value:number;

    @IsEnum(PaymentMethod, {message:'Enum inválido'})
    paymentMethod:PaymentMethod;

    @IsEnum(TransactionType, {message: 'Enum inválido'})
    type:TransactionType;
}