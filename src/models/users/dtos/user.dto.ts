import { Exclude, Expose } from "class-transformer";
import { BaseEntity } from "src/common/entities/base-entity";
import { CompanyDto } from "src/models/companies/dtos/company.dto";

export class UserDto extends BaseEntity {
    constructor(partial: Partial<UserDto>) {
        super();
        Object.assign(this, partial);
    }

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
}