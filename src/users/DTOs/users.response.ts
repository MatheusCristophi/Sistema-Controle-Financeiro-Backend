import { UserEntity } from "../users.entity";

export class UserResponse {

    name: string;

    email: string;

    saldo: number;

    static fromUser(
        user: UserEntity
    ): UserResponse {
        return {
            name: user.name,
            email: user.email,
            saldo: user.saldo
        }
    }
}