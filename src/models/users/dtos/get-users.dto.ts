import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Direction } from "src/utils/pagination.util";
import { Transform } from "class-transformer";

export class GetUsersDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    id?: string;
    
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;
    
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    companyId?: string;
    
    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === "true")
    deleted: boolean;

    @ApiProperty({ required: false, default: 'createdAt' })
    @IsOptional()
    @IsString()
    orderBy: string;

    @ApiProperty({ required: false, default: 'desc', enum: Direction })
    @IsOptional()
    @IsEnum(Direction)
    direction: keyof typeof Direction;

    @ApiProperty({ required: false, default: 10 })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    size: number;

    @ApiProperty({ required: false, default: 0 })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    page: number;
}