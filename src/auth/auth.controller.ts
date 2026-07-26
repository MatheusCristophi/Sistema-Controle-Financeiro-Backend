import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthRequest } from "./DTOs/auth.request";
import { AuthLogin } from "./DTOs/auth.login";

@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('registrar')
    async signUp(@Body() authRequest:AuthRequest) {
        return this.authService.register(authRequest);
    }

    @Post('logar')
    async singIn(
        @Body() login: AuthLogin
    ) {
        return this.authService.login(login.email, login.password);
    }
}