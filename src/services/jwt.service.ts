import jwt, {JwtPayload, Secret} from 'jsonwebtoken';
import {JWTPayload, JWTConfig} from '../types/jwt.types';
import {ENV_CONFIG} from '../config/env.config';
import {StringValue} from 'ms';

export class JWTService {

  static generateToken(payload : JwtPayload): string {
    return jwt.sign(payload, ENV_CONFIG.JWT_SECRET as Secret, {
      expiresIn: ENV_CONFIG.JWT_EXPIRES_IN as StringValue | number
    });
  }

  static verifyToken(token : string): JWTPayload {
    return jwt.verify(token, ENV_CONFIG.JWT_SECRET as Secret) as JWTPayload;
  }
} 