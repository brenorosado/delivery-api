import {
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  
  export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      console.log("request.session", request.session);
      if (!request.session.userId) {
        throw new UnauthorizedException();
      }
      return request.session.userId;
    }
  }
  