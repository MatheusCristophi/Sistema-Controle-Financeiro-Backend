import { IsEmail, IsStrongPassword } from "class-validator";  

export class AuthLogin {
    @IsEmail({}, { message: 'E-mail inválido' })
    email: string;

    @IsStrongPassword(
        {},
        { message: 'A senha precisa ter no minimo 8 caracteres e uma letra maiuscula' }
    )
    password: string;
}