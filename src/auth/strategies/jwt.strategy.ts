import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (_req, _rawJwt, done) => {
        const secret = config.get<string>('JWT_SECRET');
        done(null, secret);
      },
    });
  }

  // NestJS llama validate() después de verificar la firma JWT
  // El objeto retornado se inyecta en req.user
  async validate(payload: JwtPayload) {
    return { id: payload.sub, email: payload.email };
  }
}
