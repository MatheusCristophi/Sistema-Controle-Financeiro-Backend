import { UserEntity } from 'src/users/users.entity';
import { AuthRequest } from './DTOs/auth.request';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthResponse } from './DTOs/auth.response';
import { JwtPayload } from './jwtpayload';
import { JwtService } from '@nestjs/jwt';
import { UserResponse } from 'src/users/DTOs/users.response';
import { LoginRequest } from './DTOs/login.request';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) { }

    async register(authRequest: AuthRequest) {

        const exist = await this.userRepository.findOneBy({ email: authRequest.email });

        if (!exist) {
            const user = new UserEntity();

            user.name = authRequest.name;
            user.email = authRequest.email;
            user.password = await bcrypt.hash(authRequest.password, 12);

            await this.userRepository.save(user);

            return UserResponse.fromUser(user);
        } else {
            throw new BadRequestException("O Usuário ja existe");
        }
    }

    async login(loginRequest: LoginRequest) {

        const user = await this.userRepository.findOne({
            where: { email: loginRequest.email, }
        });

        if (!user) throw new NotFoundException('E-mail ou Senha inválidos');

        const isMatch: boolean = await bcrypt.compare(loginRequest.password, user.password);

        if (isMatch) {
            const payload: JwtPayload = {
                sub: user.id,
                name: user.name,
                email: user.email,
                balance: user.balance
            }

            const token = this.jwtService.sign(payload, { expiresIn: '1h' })

            return AuthResponse.fromAuth(token, user);
        }
        throw new NotFoundException('E-mail ou Senha inválidos');
    }
}