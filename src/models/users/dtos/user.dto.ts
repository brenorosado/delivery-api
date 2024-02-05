import { Exclude, Expose } from "class-transformer";
import { CompanyDto } from "src/models/companies/dtos/company.dto";

export class UserDto {
    constructor(partial: Partial<UserDto>) {
        Object.assign(this, partial);
    }

    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    username: string

    @Exclude()
    password: string

    @Expose()
    company: CompanyDto;

    @Exclude()
    companyId: string;

    @Expose()
    deleted: boolean;
    
    @Expose()
    updatedAt: Date;

    @Expose()
    updatedBy: string;

    @Expose()
    createdAt: Date;

    @Expose()
    createdBy: string;
}