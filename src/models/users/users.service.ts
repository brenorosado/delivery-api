import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { encryptKey } from "src/utils/encrypt-keys.util";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Prisma, User } from "@prisma/client";
import { GetUsersDto } from "./dtos/get-users.dto";
import { getPagination, paginatedParser } from "src/utils/pagination.util";

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    async createUser(
        {company, ...createUserDto}: CreateUserDto,
        requestingUser: User
    ) {
        const userWithSameUsername = await this.prismaService.user.findUnique({
            where: {
                username: createUserDto.username
            }
        });

        if (userWithSameUsername) {
            throw new BadRequestException("Username already registered.");
        }

        const encryptedPassword = await encryptKey(createUserDto.password);

        return this.prismaService.user.create({
            data: {
                ...createUserDto,
                password: encryptedPassword,
                ...(company && {
                    company: {
                        connect: {
                            id: company.id
                        }
                    }
                }),
                createdBy: requestingUser.username
            },
            include: { company: true }
        })
    }

    async updateUser(
        {
            company,
            id,
            ...updateUserDto
        }: UpdateUserDto,
        requestingUser: User
    ) {
        const userToUpdate = await this.prismaService.user.findUnique({ where: { id } });

        if (!userToUpdate) {
            throw new BadRequestException("User not found.");
        }
        
        return this.prismaService.user.update({
            where: { id },
            data: {
                ...updateUserDto,
                ...(company && {
                    company: {
                        connect: {
                            id: company.id
                        }
                    }
                }),
                updatedBy: requestingUser.username
            },
            include: { company: true }
        })
    }

    async toggleUserDeletedStatusById(id: string, deleted: boolean, requestingUser: User) {
        const userToChangeDeletedStatus = await this.prismaService.user.findUnique({ where: { id } });

        if (!userToChangeDeletedStatus) {
            throw new BadRequestException("User not found.");
        }

        return this.prismaService.user.update({
            where: { id },
            data: {
                deleted,
                updatedBy: requestingUser.username
            },
            include: { company: true }
        })
    }

    async getUserById(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: { id },
            include: {
                company: true
            }
        });

        if (!user)
            throw new NotFoundException("User not found.");

        return user;
    }

    getUsers({
        id,
        name,
        username,
        companyId,
        deleted,
        orderBy,
        direction,
        size,
        page
    }: GetUsersDto) {
        const filters = {
            ...(id && { id }),
            ...(companyId && { companyId }),
            ...(name && { name: { contains: name, mode: Prisma.QueryMode.insensitive } }),
            ...(username && { username: { contains: username, mode: Prisma.QueryMode.insensitive } }),
            ...(typeof deleted !== "undefined" && { deleted })
        }

        const pagination = getPagination(size, page);
        const ordenation = { [orderBy]: direction }
    
        return paginatedParser(
            this.prismaService.$transaction([
                this.prismaService.user.count({ where: filters }),
                this.prismaService.user.findMany({
                    ...pagination,
                    orderBy: ordenation,
                    where: filters
                })
            ]),
            page,
            pagination.take
        )
    }
}