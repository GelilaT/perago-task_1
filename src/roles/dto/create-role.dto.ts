import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsUUID, MinLength, ValidateIf } from "class-validator"

export class CreateRoleDto{
    
    @ApiProperty()
    @IsString()
    @MinLength(1)
    name: string

    @ApiProperty()
    @IsString()
    @MinLength(1)
    description: string

    @ApiProperty({ nullable: true, type: String, format: 'uuid', example: null })
    @IsUUID()
    parentID: string
}