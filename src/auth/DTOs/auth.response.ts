import { UserEntity } from "src/users/users.entity";

export class AuthResponse{

    name:string;

    email:string;

    balance:number;

    static fromAuth(user:UserEntity) {
        return {
            name: user.name,
            email: user.email,
            balance: user.balance
        }
    }
}