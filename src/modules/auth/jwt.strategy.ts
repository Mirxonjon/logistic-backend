import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfig } from '@/common/config/app.config';

export type JwtPayload = { userId: number; role: 'ADMIN' | 'DISPATCHER' };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JwtConfig.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
