import { UserEntity } from "../users.entity";

export class UserResponse {

    name: string;

    email: string;

    balance: string;

    static fromUser(
        user: UserEntity
    ): UserResponse {
        return {
            name: user.name,
            email: user.email,
            balance: user.balance
        }
    }
}