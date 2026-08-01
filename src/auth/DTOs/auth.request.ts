import { IsEmail, IsString, IsStrongPassword, MinLength } from "class-validator";

export class AuthRequest{

    @IsString({message:'O Nome deve ser uma string'})
    @MinLength(6, {message: 'O nome deve ter no minimo 6 caracteres'})
    name:string;

    @IsEmail({}, {message: 'E-mail inválido'})
    email:string;

    @IsStrongPassword(
        {},
        {message: 'A senha está muito Fraca'}
    )
    password:string;

}