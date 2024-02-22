import { Expose } from "class-transformer";

export class BaseEntity {
    @Expose()
    id: string;

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