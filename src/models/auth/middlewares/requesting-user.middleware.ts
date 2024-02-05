import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
  } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
  
  declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
      interface Request {
        requestingUser?: User;
        session: { userId: string };
      }
    }
  }
  
  @Injectable()
  export class RequestingUserMiddleware implements NestMiddleware {
    constructor(private prismaService: PrismaService) {}
    async use(req: Request, res: Response, next: NextFunction) {
      const { userId } = req.session || {};
      if (userId) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId }
        });
  
        if (!user) {
          req.session.userId = null;
          throw new UnauthorizedException();
        }
  
        req.requestingUser = user;
      }
  
      next();
    }
  }
  