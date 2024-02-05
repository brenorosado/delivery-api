import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";
import { UpdateCompanyDto } from "src/models/companies/dtos/update-company.dto";

export class CreateUserDto {
    @ApiProperty({ required: true })
    @IsString()
    name: string;

    @ApiProperty({ required: true })
    @IsString()
    username: string;

    @ApiProperty({ required: true })
    @IsString()
    password: string;

    @ApiProperty({ required: true })
    @ValidateNested()
    @Type(() => UpdateCompanyDto)
    company: UpdateCompanyDto;
}