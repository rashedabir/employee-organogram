import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EmployeeEntity } from '../entities/employee.entity';

@Injectable()
export class EmployeeRepository extends Repository<EmployeeEntity> {
  constructor(private dataSource: DataSource) {
    super(EmployeeEntity, dataSource.createEntityManager());
  }
}
