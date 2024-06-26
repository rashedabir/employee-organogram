import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

  const mockEmployeeService = {
    findHierarchy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the hierarchy of employees', async () => {
      const result = { message: 'successful', result: [] };
      mockEmployeeService.findHierarchy.mockResolvedValue(result.result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockEmployeeService.findHierarchy).toHaveBeenCalledWith(1);
    });
  });

  describe('findAll (protected)', () => {
    it('should return the hierarchy of employees for a private route', async () => {
      const result = { message: 'successful', result: [] };
      mockEmployeeService.findHierarchy.mockResolvedValue(result.result);

      expect(await controller.findAll('1')).toEqual(result);
      expect(mockEmployeeService.findHierarchy).toHaveBeenCalledWith(1);
    });
  });
});
