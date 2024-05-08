import { Entity, Column, Check, TreeChildren, Tree, TreeParent, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role')
@Tree('closure-table')
@Check(`"parentID" <> "id"`)
export class RoleEntity {
  
  @PrimaryGeneratedColumn("uuid")
  id: string;
    
  @Column()
  name: string;
    
  @Column()
  description: string; 
    
  @Column({ type : 'uuid', nullable : true})
  parentID: string;
  
  @TreeParent()
  parent: RoleEntity
  
  @TreeChildren()
  children: RoleEntity[]  
   
}