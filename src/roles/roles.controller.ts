import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleDto } from './dto/role.dto';

@Controller('roles')
export class RolesController {

    constructor(private readonly roleService: RolesService){}
    @Get()
    async findAll() {
        const roles = await this.roleService.findAll()
        return roles.map(role => new RoleDto(role))
    }

    @Get(':id/descendants')
    async findTree(@Param('id') id: string) {
        return await this.roleService.findTree(id)
    }
    @Get(':id/desc')
    async findTreeRecur(@Param('id') id: string) {
        return await this.roleService.findTreeRecur(id)
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.roleService.findOne(id)
    }


    @Post()
    async create(@Body() createRoleDto: CreateRoleDto) {
        const role = await this.roleService.create(createRoleDto)
        return new RoleDto(role)
    }

    @Patch(':id')
    async update(@Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto) {
        return await this.roleService.update(id, updateRoleDto)
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.roleService.delete(id)
    }

}
