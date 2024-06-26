import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthController } from './users.controller';
import { UserAuthService } from './users.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserProfileDto } from './dto/user-profile-update.dto';
import { UserChangePasswordDto } from './dto/change-password.dto';
import { UserPayloadInterface } from 'src/common/interfaces/user-payload.interface';
import { BadRequestException } from '@nestjs/common';

describe('UserAuthController', () => {
  let controller: UserAuthController;
  let service: UserAuthService;

  const mockUserAuthService = {
    userRegistration: jest.fn(),
    userLogin: jest.fn(),
    profileUpdate: jest.fn(),
    getProfile: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAuthController],
      providers: [
        {
          provide: UserAuthService,
          useValue: mockUserAuthService,
        },
      ],
    }).compile();

    controller = module.get<UserAuthController>(UserAuthController);
    service = module.get<UserAuthService>(UserAuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registration', () => {
    it('should register a new user', async () => {
      const userRegistrationDto: UserRegistrationDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        access_token: 'testToken',
      };

      jest.spyOn(service, 'userRegistration').mockResolvedValueOnce(result);

      expect(await controller.registration(userRegistrationDto)).toEqual({
        message: 'successful',
        result,
      });
    });

    it('should throw an error if email is already used', async () => {
      const userRegistrationDto: UserRegistrationDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      jest
        .spyOn(service, 'userRegistration')
        .mockRejectedValueOnce(
          new BadRequestException('This email is already used.'),
        );

      await expect(
        controller.registration(userRegistrationDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login a user with correct credentials', async () => {
      const userLoginDto: UserLoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        access_token: 'testToken',
      };

      jest.spyOn(service, 'userLogin').mockResolvedValueOnce(result);

      expect(await controller.login(userLoginDto)).toEqual({
        message: 'successful',
        result,
      });
    });

    it('should throw an error if email is not registered', async () => {
      const userLoginDto: UserLoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest
        .spyOn(service, 'userLogin')
        .mockRejectedValueOnce(
          new BadRequestException('This email is not registered.'),
        );

      await expect(controller.login(userLoginDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update user profile', async () => {
      const userProfileDto: UserProfileDto = {
        firstName: 'John',
        lastName: 'Doe',
      };

      const userPayload: UserPayloadInterface = {
        id: 1,
        email: 'test@example.com',
      };

      const result = 'Raw Updated';

      jest.spyOn(service, 'profileUpdate').mockResolvedValueOnce(result);

      expect(await controller.create(userProfileDto, userPayload)).toEqual({
        message: 'successful',
        result,
      });
    });
  });

  describe('profile', () => {
    it('should get user profile', async () => {
      const userPayload: UserPayloadInterface = {
        id: 1,
        email: 'test@example.com',
      };

      const result = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'getProfile').mockResolvedValueOnce(result);

      expect(await controller.profile(userPayload)).toEqual({
        message: 'successful',
        result,
      });
    });
  });

  describe('change-password', () => {
    it('should change user password', async () => {
      const userChangePasswordDto: UserChangePasswordDto = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      };

      const userPayload: UserPayloadInterface = {
        id: 1,
        email: 'test@example.com',
      };

      const result = 'Password Updated';

      jest.spyOn(service, 'changePassword').mockResolvedValueOnce(result);

      expect(
        await controller.changePass(userChangePasswordDto, userPayload),
      ).toEqual({
        message: 'successful',
        result,
      });
    });
  });
});
