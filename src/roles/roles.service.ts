import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { QueryFailedError, TreeRepository } from 'typeorm';

@Injectable()
export class RolesService {

    constructor(@InjectRepository(RoleEntity) private roleRepository: TreeRepository<RoleEntity>) { }
    
    findAll() {
        return this.roleRepository.findTrees()
    }

    async findOne(id: string) {
        const role = await this.roleRepository.findOne({ where: { id } })
        if (!role) {
            throw new NotFoundException('Role not found')
        }
        return role
    }

    async create(newRole: CreateRoleDto) {
        
        try {
            const role = this.roleRepository.create({
                ...newRole,
                parent: newRole.parentID? { id: newRole.parentID } : null
            })

            const parent = await this.roleRepository.findOne({ where: {parentID: null}})
            if (parent && newRole.parentID === null) {
                throw new BadRequestException('Root Role already exists')
            }
        
            return await this.roleRepository.save(role)

        } catch(err) {
            switch (err.constructor) {
                case BadRequestException:
                    throw new BadRequestException('Parent role does not exist')
                    
                default:
                    throw new BadRequestException('An error occured')         
            }
        }
    }
    
    async update(id: string, updateRole: UpdateRoleDto) {
        const updatedRole = await this.roleRepository.findOne({ where: { id } })

        const roles = await this.roleRepository.update(id, updateRole)
        return {...updatedRole, ...roles}
        
    }

    async delete(id: string) {
        
        try {
            await this.roleRepository.delete(id)
        } catch(err) {
            switch (err.constructor){
                case QueryFailedError:
                    throw new Error("Role has children")
                default:
                    throw new Error(err.message)
            }
        }
    }

    async findTree(id: string) {
        try {
            return await this.roleRepository.findDescendantsTree({ id } as RoleEntity)
        } catch (err) {
            throw new Error(err.message)
        }
    }
    
    async findTreeRecur(id: string){
        try {
            const role = await this.roleRepository.findOne({ where: { id } });
            if (!role) {
                return null;
            }
            const child = await this.roleRepository.find()
            const tree = await this.findTreeRecursively(role, {});
            return tree;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async findTreeRecursively(role: RoleEntity, tree: any){
        const children = await this.roleRepository.find({ where: {parentID: role.id} });
        if (!children) {
            return null;
        }

        tree.id = role.id;
        tree.children = [];
        for (const child of children) {
            const childTree: any = {};
            await this.findTreeRecursively(child, childTree);
            tree.children.push(childTree);
            
        }

        return tree;
    }

}
