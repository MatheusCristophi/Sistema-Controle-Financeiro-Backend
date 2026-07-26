import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthRequest } from "./DTOs/auth.request";
import { LoginRequest } from "./DTOs/login.request";

@Controller()
export class AuthController{
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('registrar')
    @HttpCode(HttpStatus.OK)
    signUp(@Body() authRequest:AuthRequest) {
        return this.authService.register(authRequest);
    }

    @Post('logar')
    @HttpCode(HttpStatus.OK)
    singIn(
        @Body() login: LoginRequest) {
        return this.authService.login(login);
    }
}