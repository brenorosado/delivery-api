import { Expose } from "class-transformer";
import { BaseEntity } from "src/common/entities/base-entity";

export class CompanyDto extends BaseEntity {
    constructor(partial: Partial<CompanyDto>) {
        super();
        Object.assign(this, partial);
    }

    @Expose()
    name: string;

    @Expose()
    taxNumber: string
}