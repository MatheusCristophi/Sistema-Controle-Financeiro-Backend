import { UserEntity } from 'src/users/users.entity';
import { AuthRequest } from './DTOs/auth.request';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthResponse } from './DTOs/auth.response';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async register(authRequest: AuthRequest) {

        const exist = await this.userRepository.findOneBy({ email: authRequest.email });

        if (!exist) {
            const user = new UserEntity();

            user.name = authRequest.name;
            user.email = authRequest.email;
            user.password = await bcrypt.hash(authRequest.password, 12);

            await this.userRepository.save(user);

            return AuthResponse.fromAuth(user);
        } else {
            throw new BadRequestException("O Usuário ja existe");
        }
    }

    async login(email: string, password: string) {

        const user = await this.userRepository.findOne({
            where: {email: email,}
        });

        if (!user) throw new UnauthorizedException('E-mail ou Senha inválidos');

        const isMatch: boolean = await bcrypt.compare(password, user.password);

        if (isMatch) {
            return AuthResponse.fromAuth(user);
        } else {
            throw new UnauthorizedException('E-mail ou Senha inválidos');
        }
    }
}