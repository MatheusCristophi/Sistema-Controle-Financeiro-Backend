import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthRequest } from "./DTOs/auth.request";
import { LoginRequest } from "./DTOs/login.request";

@Controller()
export class AuthController{
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('register')
    @HttpCode(200)
    signUp(@Body() authRequest:AuthRequest) {
        return this.authService.register(authRequest);
    }

    @Post('login')
    @HttpCode(200)
    singIn(
        @Body() login: LoginRequest) {
        return this.authService.login(login);
    }
}