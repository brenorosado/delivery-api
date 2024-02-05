import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UserDto } from "./dtos/user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { RequestingUser } from "../auth/decorators/requesting-user.decorator";
import { User } from "@prisma/client";
import { GetUsersDto } from "./dtos/get-users.dto";
import { PaginatedUsersDto } from "./dtos/paginated-users.dto";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('/users')
@ApiTags("User")
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('/')
    async createUser(
        @Body() body: CreateUserDto,
        @RequestingUser() requestingUser: User    
    ): Promise<UserDto> {
        const user = await this.usersService.createUser(body, requestingUser);
        return new UserDto(user);
    }
    
    @Put('/')
    async updateUser(
        @Body() body: UpdateUserDto,
        @RequestingUser() requestingUser: User
    ): Promise<UserDto> {
        const user = await this.usersService.updateUser(body, requestingUser);
        return new UserDto(user);
    }

    @Delete('/:id')
    async deleteUserById(
        @Param('id') id: string,
        @RequestingUser() requestingUser: User
    ): Promise<UserDto> {
        const user = await this.usersService.toggleUserDeletedStatusById(id, true, requestingUser);
        return new UserDto(user);
    }

    @Patch('/recover/:id')
    async recoverUserById(
        @Param('id') id: string,
        @RequestingUser() requestingUser: User
    ): Promise<UserDto> {
        const user = await this.usersService.toggleUserDeletedStatusById(id, false, requestingUser);
        return new UserDto(user);
    }

    @Get('/')
    async getCompanies(@Query() query: GetUsersDto): Promise<PaginatedUsersDto> {
        const paginatedUsers = await this.usersService.getUsers(query);
        return new PaginatedUsersDto(paginatedUsers);
    }

    @Get('/:id')
    async getCompanyById(@Param('id') id: string): Promise<UserDto> {
        const user = await this.usersService.getUserById(id);
        return new UserDto(user);
    }
}