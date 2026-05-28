import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;

    if (!authHeader) return false;

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, 'super-secret-key');

      if (
        typeof decoded !== 'object' ||
        decoded === null ||
        !('sub' in decoded) ||
        !('email' in decoded)
      ) {
        return false;
      }

      if (
        typeof decoded === 'object' &&
        decoded !== null &&
        'sub' in decoded &&
        'email' in decoded
      ) {
        const sub = (decoded as Record<string, unknown>).sub;
        const email = (decoded as Record<string, unknown>).email;

        if (typeof sub !== 'number' && typeof sub !== 'string') return false;
        if (typeof email !== 'string') return false;

        const payload: JwtPayload = {
          sub: Number(sub),
          email,
        };

        (request as unknown as { user: JwtPayload }).user = payload;

        return true;
      }
    } catch {
      return false;
    }
    return false;
  }
}
