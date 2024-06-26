import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../user/guards/jwt.guard';
import { EmployeeService } from './employee.service';

@ApiTags('Employee')
@Controller({
  //path name
  path: 'employee',
  //route version
  version: '1',
})
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.employeeService.findHierarchy(+id);

    return { message: 'successful', result: data };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @Get('private-route/:id')
  async findAll(@Param('id') id: string) {
    const data = await this.employeeService.findHierarchy(+id);

    return { message: 'successful', result: data };
  }
}
