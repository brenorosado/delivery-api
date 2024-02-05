import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dtos/create-company.dto";
import { CompanyDto } from "./dtos/company.dto";
import { ApiTags } from "@nestjs/swagger";
import { UpdateCompanyDto } from "./dtos/update-company.dto";
import { GetCompaniesDto } from "./dtos/get-companies.dto";
import { PaginatedCompaniesDto } from "./dtos/paginated-companies.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { RequestingUser } from "../auth/decorators/requesting-user.decorator";
import { User } from "@prisma/client";

@Controller("/companies")
@ApiTags("Company")
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard) // TROCAR PARA GUARD DE ADM MASTER DO SISTEMA
export class CompaniesController {
    constructor(private companiesService: CompaniesService) {}

    @Post("/")
    async createCompany(
        @Body() body: CreateCompanyDto,
        @RequestingUser() requestingUser: User   
    ): Promise<CompanyDto> {
        const company = await this.companiesService.createCompany(body, requestingUser);
        return new CompanyDto(company);
    }

    @Put("/")
    async updateCompany(
        @Body() body: UpdateCompanyDto,
        @RequestingUser() requestingUser: User
    ): Promise<CompanyDto> {
        const company = await this.companiesService.updateCompany(body, requestingUser);
        return new CompanyDto(company);
    }

    @Delete('/:id')
    async deleteCompanyById(
        @Param('id') id: string,
        @RequestingUser() requestingUser: User
    ): Promise<CompanyDto> {
        const company = await this.companiesService.toggleCompanyDeletedStatusById(id, true, requestingUser);
        return new CompanyDto(company);
    }

    @Patch('/recover/:id')
    async recoverCompanyById(
        @Param('id') id: string,
        @RequestingUser() requestingUser: User
    ): Promise<CompanyDto> {
        const company = await this.companiesService.toggleCompanyDeletedStatusById(id, false, requestingUser);
        return new CompanyDto(company);
    }

    @Get('/')
    async getCompanies(@Query() query: GetCompaniesDto): Promise<PaginatedCompaniesDto> {
        const paginatedCompanies = await this.companiesService.getCompanies(query);
        return new PaginatedCompaniesDto(paginatedCompanies);
    }

    @Get('/:id')
    async getCompanyById(@Param('id') id: string): Promise<CompanyDto> {
        const company = await this.companiesService.findCompanyById(id);
        return new CompanyDto(company);
    }
}