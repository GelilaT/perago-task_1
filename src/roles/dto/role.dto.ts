import { ApiProperty } from "@nestjs/swagger";
import { RoleEntity } from "../entities/role.entity";

export class RoleDto{

    @ApiProperty()
    id: string
    
    @ApiProperty()
    name: string

    @ApiProperty()
    description: string

    @ApiProperty()
    parentId: string | null

    @ApiProperty({type: [RoleDto]})
    children: RoleDto[]

    constructor(role: RoleEntity) {
        this.id = role.id;
        this.name = role.name;
        this.description = role.description;
        this.parentId = role.parent?.id
        this.children = role.children?.map((role) => new RoleDto(role))
    }

}