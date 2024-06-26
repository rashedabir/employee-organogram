import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from './entities/employee.entity';
import { PositionEntity } from './entities/position.entity';
import { EmployeeRepository } from './repository/employee.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity, PositionEntity])],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepository],
})
export class EmployeeModule {}
