import { IsEmail, IsStrongPassword } from "class-validator";

export class LoginRequest {

    @IsEmail({}, { message: 'E-mail inválido' })
    email: string;

    @IsStrongPassword(
        {},
        { message: 'A senha está muito Fraca' }
    )
    password: string;
}