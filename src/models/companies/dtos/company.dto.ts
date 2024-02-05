import { Expose } from "class-transformer";

export class CompanyDto {
    constructor(partial: Partial<CompanyDto>) {
        Object.assign(this, partial);
    }

    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    taxNumber: string

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