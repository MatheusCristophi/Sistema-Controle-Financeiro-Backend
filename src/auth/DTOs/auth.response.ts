import { UserEntity } from "src/users/users.entity";

export class AuthResponse{

    token:string;

    name:string;

    email:string;

    static fromAuth(token:string ,user:UserEntity) {
        return {
            token,
            name: user.name,
            email: user.email
        }
    }
}