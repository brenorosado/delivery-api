import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { SignInDto } from "./dtos/sign-in.dto";
import { validateKey } from "src/utils/encrypt-keys.util";

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) {}

    async signIn({ username, password }: SignInDto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                username,
                deleted: false
            },
            include: {
                company: true
            }
        });

        if (!user)
            throw new UnauthorizedException("Invalid credentials.");

        const passwordMatch = await validateKey(password, user.password);
        
        if (!passwordMatch) 
            throw new UnauthorizedException('Invalid credentials.');
        
        if (user.deleted) 
            throw new UnauthorizedException("Account deleted.")

        if (user?.company?.deleted)
            throw new UnauthorizedException("Account company deleted.")
      
        return user;
    }

    getRequestingUser(id: string) {
        return this.prismaService.user.findUnique({ where: { id } });
    }
}