import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthController } from './users.controller';
import { UserAuthService } from './users.service';

describe('UsersController', () => {
  let controller: UserAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAuthController],
      providers: [UserAuthService],
    }).compile();

    controller = module.get<UserAuthController>(UserAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
