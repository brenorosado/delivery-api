import { PrismaService } from "src/prisma.service";
import { CreateCompanyDto } from "./dtos/create-company.dto";
import { UpdateCompanyDto } from "./dtos/update-company.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { GetCompaniesDto } from "./dtos/get-companies.dto";
import { Prisma, User } from "@prisma/client";
import { getPagination, paginatedParser } from "src/utils/pagination.util";

@Injectable()
export class CompaniesService {
    constructor(private prismaService: PrismaService) {}

    createCompany(
        createCompanyDto: CreateCompanyDto,
        requestingUser: User
    ) {
        return this.prismaService.company.create({
            data: {
                ...createCompanyDto,
                createdBy: requestingUser.username
            }
        });
    }

    async updateCompany(
        { id, ...updateCompanyDto }: UpdateCompanyDto,
        requestingUser: User
    ) {
        const companyToUpdate = await this.prismaService.company.findUnique({ where: { id } });

        if (!companyToUpdate)
            throw new NotFoundException("Company not found.");

        return this.prismaService.company.update({
            where: { id },
            data: {
                ...updateCompanyDto,
                updatedBy: requestingUser.username
            }
        });
    }

    findCompanyById(id: string) {
        return this.prismaService.company.findUnique({ where: { id } });
    }

    async toggleCompanyDeletedStatusById(id: string, deleted: boolean, requestingUser: User) {
        const companyToChangeDeletedStatus =
            await this.prismaService.company.findUnique({ where: { id } });
        
        if (!companyToChangeDeletedStatus)
            throw new NotFoundException("Company not found.");

        return this.prismaService.company.update({
            where: { id },
            data: {
                deleted,
                updatedBy: requestingUser.username
            }
        });
    }

    getCompanies({
        id,
        name,
        taxNumber,
        deleted,
        orderBy,
        direction,
        size,
        page
    }: GetCompaniesDto) {
        const filters = {
            ...(id && { id }),
            ...(name && { name: { contains: name, mode: Prisma.QueryMode.insensitive } }),
            ...(taxNumber && { taxNumber: { contains: taxNumber, mode: Prisma.QueryMode.insensitive } }),
            ...(typeof deleted !== "undefined" && { deleted })
        }

        const pagination = getPagination(size, page);
        const ordenation = { [orderBy]: direction }
    
        return paginatedParser(
            this.prismaService.$transaction([
                this.prismaService.company.count({ where: filters }),
                this.prismaService.company.findMany({
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