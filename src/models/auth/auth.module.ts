import { MiddlewareConsumer, Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { RequestingUserMiddleware } from "../auth/middlewares/requesting-user.middleware";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";


@Module({
    imports: [],
    controllers: [AuthController],
    providers: [PrismaService, AuthService],
})
export class AuthModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestingUserMiddleware).forRoutes('*');
    }
}