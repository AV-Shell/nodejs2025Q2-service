import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException();
      }
      const jwtAccessSecretKey = this.configService.get<string>(
        `JWT_ACCESS_SECRET_KEY`,
      );

      const verifyResult = this.jwtService.verify(token, {
        secret: jwtAccessSecretKey,
      });
      console.log('verifyResult', verifyResult);
      return true;
    } catch (e) {
      throw new UnauthorizedException({ message: 'User not authorised' });
    }
  }
}
