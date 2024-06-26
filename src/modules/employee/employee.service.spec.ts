import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { EmployeeEntity } from './entities/employee.entity';
import { BadGatewayException } from '@nestjs/common';
import { EmployeeRepository } from './repository/employee.repository';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repository: EmployeeRepository;

  const mockEmployeeRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: EmployeeRepository,
          useValue: mockEmployeeRepository,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    repository = module.get<EmployeeRepository>(EmployeeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findHierarchy', () => {
    it('should throw an error if the employee is not found', async () => {
      mockEmployeeRepository.findOne.mockResolvedValue(null);

      await expect(service.findHierarchy(1)).rejects.toThrow(
        BadGatewayException,
      );
    });

    it('should return the hierarchy of employees', async () => {
      const rootEmployee = { id: 1, children: [] } as EmployeeEntity;
      const childEmployee = {
        id: 2,
        parent: rootEmployee,
        children: [],
      } as EmployeeEntity;
      rootEmployee.children = [childEmployee];

      mockEmployeeRepository.findOne.mockResolvedValue(rootEmployee);
      mockEmployeeRepository.find.mockResolvedValue([childEmployee]);

      const result = await service.findHierarchy(1);

      expect(result).toEqual([childEmployee]);
      expect(mockEmployeeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['position', 'children'],
      });
      expect(mockEmployeeRepository.find).toHaveBeenCalledWith({
        where: { parent: { id: 1 } },
        relations: ['position', 'children'],
      });
    });
  });
});
