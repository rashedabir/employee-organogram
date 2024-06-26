import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserAuthService } from './users.service';
import { UserRepository } from './repository/user.repository';
import { BadRequestException } from '@nestjs/common';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserEntity } from './entities/user.entity';

describe('UserAuthService', () => {
  let service: UserAuthService;
  let repository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthService,
        {
          provide: UserRepository,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              update: jest.fn().mockReturnThis(),
              set: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              execute: jest.fn().mockResolvedValue({ affected: 1 }),
              getOne: jest.fn().mockResolvedValue({
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'test@example.com',
              }),
            })),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('testToken'),
          },
        },
      ],
    }).compile();

    service = module.get<UserAuthService>(UserAuthService);
    repository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('userRegistration', () => {
    it('should register a new user', async () => {
      const userRegistrationDto: UserRegistrationDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'save').mockResolvedValueOnce({
        ...userRegistrationDto,
        id: 1,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      });

      const result = await service.userRegistration(userRegistrationDto);
      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        access_token: 'testToken',
      });
    });

    it('should throw an error if email is already used', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(
        Promise.resolve({
          id: 1,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password',
          createdAt: new Date().toISOString(),
          updatedAt: new Date(),
        }),
      );

      await expect(
        service.userRegistration({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('userLogin', () => {
    it('should login a user with correct credentials', async () => {
      const userLoginDto: UserLoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const user = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date().toISOString(),
        updatedAt: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      const result = await service.userLogin(userLoginDto);
      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        access_token: 'testToken',
      });
    });

    it('should throw an error if email is not registered', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.userLogin({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if password is incorrect', async () => {
      const user = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        createdAt: new Date().toISOString(),
        updatedAt: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      await expect(
        service.userLogin({
          email: 'test@example.com',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // Additional tests for other methods can be added similarly
});
