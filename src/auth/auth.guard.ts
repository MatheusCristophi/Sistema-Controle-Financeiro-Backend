import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecret: string;

  constructor(
    private readonly jwtService:JwtService,
    private readonly configService:ConfigService,
    private readonly reflector:Reflector,
  ) { 
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
    throw new Error('JWT_SECRET não configurado');
  } this.jwtSecret = secret
  }
  
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> { 
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; 
    } 
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Você não possui permissão para isso");
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token, {
          secret: this.jwtSecret
        }
      );

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException("Você não possui permissão para isso");
    }
    return true;
  }

  private extractTokenFromHeader(request:Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}