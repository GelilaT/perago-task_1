import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './roles/entities/role.entity';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'orga_structure',
      entities: [RoleEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),

    RolesModule,
  ],
})
export class AppModule {}