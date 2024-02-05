import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CompaniesController } from "./companies.controller";
import { PrismaService } from "src/prisma.service";
import { CompaniesService } from "./companies.service";
import { RequestingUserMiddleware } from "../auth/middlewares/requesting-user.middleware";

@Module({
    imports: [],
    controllers: [CompaniesController],
    providers: [PrismaService, CompaniesService],
})
export class CompaniesModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestingUserMiddleware).forRoutes('*');
    }
}