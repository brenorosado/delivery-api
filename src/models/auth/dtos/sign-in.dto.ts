import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignInDto {
    @ApiProperty({ required: true })
    @IsString()
    username: string;

    @ApiProperty({ required: true })
    @IsString()
    password: string;
}