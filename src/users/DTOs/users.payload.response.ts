import { UserEntity } from "../users.entity";

export class UserResponse {

    id:string;

    name: string;

    email: string;

    balance: string;

    static fromUser(
        user: UserEntity
    ): UserResponse {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            balance: user.balance
        }
    }
}