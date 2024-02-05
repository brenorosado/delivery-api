import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, Post, Session, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiTags } from "@nestjs/swagger";
import { SignInDto } from "./dtos/sign-in.dto";
import { UserDto } from "../users/dtos/user.dto";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('/auth')
@ApiTags("Auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post("/sign-in")
    async signIn(
        @Body() body: SignInDto,
        @Session() session: any,
    ): Promise<UserDto> {
        const user = await this.authService.signIn(body);
        session.userId = user.id;
        console.log("session on sign-in", session);
        return new UserDto(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post("/sign-out")
    async signOut(@Session() session: any) {
        session.userId = null;
    }
    
    @UseGuards(AuthGuard)
    @Get('/requesting-user')
    async getRequestingUser(@Session() session: any): Promise<UserDto> {
        console.log("session", session);
        const user = await this.authService.getRequestingUser(session.userId);
        return new UserDto(user);
    }
}