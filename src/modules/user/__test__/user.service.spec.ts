import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { ResponseUserDto } from '../dto/response-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../service/user.service';

describe('USER SERVICE (unit test)', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  // CREATE MOCK USER REPOSITORY

  const mockUserRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  // START AND CREATE TESTING MODULE

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  // START UNIT TEST USER SERVICE

  describe('Should be defined service and repository', () => {
    it('userService should be defined', () => {
      expect(userService).toBeDefined();
    });

    it('userRepository should be defined', () => {
      expect(userRepository).toBeDefined();
    });
  });

  describe('GET getAll', () => {
    it('Successful response => [users]', async () => {
      const responseRepository: User = {
        id: 1,
        first_name: 'logan',
        last_name: 'wolverin',
        identity_number: 'x',
        phone_number: '00000000',
        password: '123456',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const responseService: ResponseUserDto = {
        id: 1,
        first_name: 'logan',
        last_name: 'wolverin',
        identity_number: 'x',
        phone_number: '00000000',
      };
      jest.spyOn(userRepository, 'find').mockImplementation(async () => [responseRepository]);
      const service = await userService.getAll();

      expect(await service).toEqual([responseService]);
      expect(await service[0].last_name).toBe('wolverin');
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });

    it('Failed response => HttpException NOT FOUND', async () => {
      const responseService = new HttpException(
        'No users were found in the database',
        HttpStatus.NOT_FOUND,
      );

      jest.spyOn(userRepository, 'find').mockImplementation(async () => null);
      const service = await userService.getAll();

      expect(await service.getStatus()).toBe(404);
      expect(await service.message).toBe('No users were found in the database');
      expect(await service).toEqual(responseService);
    });
  });

  describe('GET findById', () => {
    it('Successful response => user', async () => {
      const id = '1';
      const responseRepository: User = {
        id: 1,
        first_name: 'logan',
        last_name: 'wolverin',
        identity_number: 'x',
        phone_number: '00000000',
        password: '123456',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const responseService: ResponseUserDto = {
        id: 1,
        first_name: 'logan',
        last_name: 'wolverin',
        identity_number: 'x',
        phone_number: '00000000',
      };
      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(async () => responseRepository);
      const service = await userService.findById(id);

      expect(await service).toEqual(responseService);
      expect(await service.last_name).toBe('wolverin');
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('Failed response => HttpException NOT FOUND', async () => {
      const id = '2';
      const responseService = new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND,
      );

      jest
        .spyOn(userRepository, 'findOne')
        .mockImplementation(async () => null);
      const service = await userService.findById(id);

      expect(await service.getStatus()).toBe(404);
      expect(await service.message).toBe('User not found');
      expect(await service).toEqual(responseService);
    });
  });

  describe('POST create', () => {
    it('Successful response => user created', async () => {
      const dto: CreateUserDto = {
        id: 1,
        first_name: 'logan',
        last_name: 'wolverin',
        identity_number: 'x',
        phone_number: '00000000',
        password: '123456',
      };

      const data = new User();
      data.first_name = 'logan';
      data.last_name = 'wolverin';
      data.identity_number = 'x';
      data.phone_number = '00000000';
      data.password = '123456';
      data.created_at = new Date();
      data.updated_at = new Date();

      jest.spyOn(userRepository, 'save').mockImplementation(async () => data);
      const service = await userService.create(dto);

      expect(await service).toEqual(data);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect((await service) instanceof User).toEqual(true);
    });
  });

  describe('PATCH update', () => {
    it('Successful response => HttpException OK', async () => {
      const id = '1';
      const responseService = new HttpException(
        'User with id ' + id + ' updated',
        HttpStatus.OK,
      );

      const responseRepository: UpdateResult = {
        affected: 1,
        generatedMaps: [{}],
        raw: '',
      };

      const dataUser = new UpdateUserDto();
      dataUser.phone_number = '111';

      jest
        .spyOn(userRepository, 'update')
        .mockImplementation(async () => responseRepository);
      const service = await userService.update(id, dataUser);

      expect(await service.getStatus()).toBe(200);
      expect(await service.message).toBe('User with id 1 updated');
      expect(await service).toEqual(responseService);
      expect(userRepository.update).toHaveBeenCalledTimes(1);
    });

    it('Failed response => HttpException NOT FOUND', async () => {
      const id = '2';
      const dataUser = new UpdateUserDto();
      dataUser.phone_number = '111';

      const responseRepository: UpdateResult = {
        affected: 0,
        generatedMaps: [{}],
        raw: '',
      };

      const responseService = new HttpException(
        'User id ' + id + ' not found in the database',
        HttpStatus.NOT_FOUND,
      );

      jest
        .spyOn(userRepository, 'update')
        .mockImplementation(async () => responseRepository);
      const service = await userService.update(id, dataUser);

      expect(await service.getStatus()).toBe(404);
      expect(await service.message).toBe('User id 2 not found in the database');
      expect(await service).toEqual(responseService);
    });
  });

  describe('DELETE remove', () => {
    it('Successful response => HttpException OK', async () => {
      const id = '1';
      const responseService = new HttpException(
        'User with id ' + id + ' removed successfully',
        HttpStatus.OK,
      );

      const responseRepository: UpdateResult = {
        affected: 1,
        generatedMaps: [{}],
        raw: '',
      };

      jest
        .spyOn(userRepository, 'delete')
        .mockImplementation(async () => responseRepository);
      const service = await userService.remove(id);

      expect(await service.getStatus()).toBe(200);
      expect(await service.message).toBe('User with id 1 removed successfully');
      expect(await service).toEqual(responseService);
      expect(userRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('Failed response => HttpException NOT FOUND', async () => {
      const id = '2';
      const responseRepository: UpdateResult = {
        affected: 0,
        generatedMaps: [{}],
        raw: '',
      };

      const responseService = new HttpException(
        'User id ' + id + ' not found in the database',
        HttpStatus.NOT_FOUND,
      );

      jest
        .spyOn(userRepository, 'delete')
        .mockImplementation(async () => responseRepository);
      const service = await userService.remove(id);

      expect(await service.getStatus()).toBe(404);
      expect(await service.message).toBe('User id 2 not found in the database');
      expect(await service).toEqual(responseService);
    });
  });
});
