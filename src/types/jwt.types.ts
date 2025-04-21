import { SignOptions, VerifyOptions } from 'jsonwebtoken';

export interface JWTPayload {
  _id: string;
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
}

export interface JWTServiceConfig {
  signOptions: SignOptions;
  verifyOptions: VerifyOptions;
}
