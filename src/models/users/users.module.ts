import { MiddlewareConsumer, Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { UsersService } from "./users.service";
import { RequestingUserMiddleware } from "../auth/middlewares/requesting-user.middleware";
import { UsersController } from "./users.controller";

@Module({
    imports: [],
    controllers: [UsersController],
    providers: [PrismaService, UsersService],
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestingUserMiddleware).forRoutes('*');
    }
}