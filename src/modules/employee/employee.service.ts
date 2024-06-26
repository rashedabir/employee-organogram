import { BadGatewayException, Injectable } from '@nestjs/common';
import { EmployeeEntity } from './entities/employee.entity';
import { EmployeeRepository } from './repository/employee.repository';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async findHierarchy(employeeId: number) {
    const rootEmployee = await this.employeeRepository.findOne({
      where: { id: employeeId },
      relations: ['position', 'children'],
    });

    if (!rootEmployee) {
      throw new BadGatewayException('Employee not found');
    }

    // Fetch the subordinates recursively
    const subordinates = await this.loadChildren(rootEmployee);

    return subordinates;
  }

  private async loadChildren(
    employee: EmployeeEntity,
  ): Promise<EmployeeEntity[]> {
    // Load the children of the current employee
    const children = await this.employeeRepository.find({
      where: { parent: { id: employee.id } },
      relations: ['position', 'children'],
    });

    // Recursively load children for each child
    for (const child of children) {
      child.children = await this.loadChildren(child);
    }

    return children;
  }
}
