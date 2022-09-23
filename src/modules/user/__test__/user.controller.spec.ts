import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ResponseUserDto } from '../dto/response-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';

describe('USER CONTROLLER (unit test)', () => {
  let userController: UserController;
  let userService: UserService;

  // CREATE MOCK USER SERVICE

  const mockUserService = {
    create: jest.fn(),
    getAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // START AND CREATE TESTING MODULE

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  // START UNIT TEST USER CONTROLLER

  describe('Should be defined controller and service', () => {
    it('UserController should be defined', () => {
      expect(userController).toBeDefined(); //comprueba si esta instanciado o definido userController
    });

    it('UserService should be defined', () => {
      expect(userService).toBeDefined(); //comprueba si esta instanciado o definido userService
    });
  });   

  describe('@POST /create', () => {
    //bloque que contiene todos los test para la ruta POST /create
    it('Successful response => user created', async () => {
      //inicio de bloque de un test

      const request: CreateUserDto = {
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

      jest.spyOn(userService, 'create').mockImplementation(async () => data); //spyOn hace un mock de la respuesta de userService

      const controller = await userController.create(request);

      expect(await controller).toEqual(data); //============>igualdad de respuesta
      expect((await controller) instanceof User).toEqual(true); //=============>verifica si la respuesta es del tipo user
      expect(userService.create).toHaveBeenCalledTimes(1); //==============>cuantas veses fue llamado userService.create
    });

    it('Failed response => HttpException BAD REQUEST', async () => {
      //inicio de bloque de un test
      let request: CreateUserDto;
      const response = new HttpException('Error', HttpStatus.BAD_REQUEST);

      jest
        .spyOn(userService, 'create')
        .mockImplementation(async () => response);
      const controller = await userController.create(request);

      expect(await controller.getStatus()).toBe(400); //================>valida si tiene un status 400
      expect(await controller.message).toBe('Error'); //================>si contiene el string error dentro de la respuesta
      expect(await controller).toEqual(response); //================>si la repuesta es igual a lo esperado
      expect(userService.create).toHaveBeenCalledTimes(2); //==============>cuantas veses fue llamado userService.create
    });
  });

  describe('@GET /all', () => {
    it('Successful response => [users]', async () => {
      const response: ResponseUserDto = {
        id: 1,
        first_name: 'logan',
        last_name: 'wolverin',
        identity_number: 'x',
        phone_number: '00000000',
      };
      jest
        .spyOn(userService, 'getAll')
        .mockImplementation(async () => [response]);
      const controller = await userController.findAll();

      expect(await controller[0].first_name).toBe('logan');
      expect(await controller[0].identity_number).toBe('x');
      expect(await controller).toEqual([response]);
      expect(userService.getAll).toHaveBeenCalledTimes(1);
    });

    it('Failed response => HttpException NOT FOUND', async () => {
      const response = new HttpException(
        'No users were found in the database',
        HttpStatus.NOT_FOUND,
      );
      jest
        .spyOn(userService, 'getAll')
        .mockImplementation(async () => response);
      const controller = await userController.findAll();

      expect(await controller.getStatus()).toBe(404);
      expect(await controller.message).toBe(
        'No users were found in the database',
      );
      expect((await controller) instanceof HttpException).toEqual(true);
      expect(userService.getAll).toHaveBeenCalledTimes(2);
    });
  });

  describe('@GET /byId/:id', () => {
    it('Successful response => user', async () => {
      const response: ResponseUserDto = {
        id: 1,
        first_name: 'logan',
        last_name: 'wolverin',
        identity_number: 'x',
        phone_number: '00000000',
      };
      const id = '1';

      jest
        .spyOn(userService, 'findById')
        .mockImplementation(async () => response);
      const controller = await userController.getById(id);

      expect(await controller.last_name).toBe('wolverin');
      expect(await controller).toEqual(response);
      expect(userService.findById).toHaveBeenCalledTimes(1);
    });

    it('Failed response => HttpException NOT FOUND', async () => {
      const response = new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND,
      );
      const id = '1';

      jest
        .spyOn(userService, 'findById')
        .mockImplementation(async () => response);
      const controller = await userController.getById(id);

      expect(await controller.getStatus()).toBe(404);
      expect(await controller.message).toBe('User not found');
      expect(await controller).toEqual(response);
    });
  });

  describe('@PATCH /update/:id', () => {
    it('Successful response => HttpException OK', async () => {
      const request = new UpdateUserDto();
      request.phone_number = '111';

      const id = '1';
      const response = new HttpException(
        'User with id ' + id + ' updated',
        HttpStatus.OK,
      );

      jest
        .spyOn(userService, 'update')
        .mockImplementation(async () => response);
      const controller = await userController.update(id, request);

      expect(await controller.getStatus()).toBe(200);
      expect(await controller.message).toBe('User with id 1 updated');
      expect(await controller).toEqual(response);
      expect(userService.update).toHaveBeenCalledTimes(1);
    });

    it('Failed response => HttpException BAD REQUEST', async () => {
      const request = new UpdateUserDto();
      request.phone_number = '111';

      const id = '2';
      const response = new HttpException(
        'User id ' + id + ' not found in the database',
        HttpStatus.BAD_REQUEST,
      );

      jest
        .spyOn(userService, 'update')
        .mockImplementation(async () => response);
      const controller = await userController.update(id, request);

      expect(await controller.getStatus()).toBe(400);
      expect(await controller.message).toBe(
        'User id 2 not found in the database',
      );
      expect(await controller).toEqual(response);
    });
  });

  describe('@DELETE /delete/:id', () => {
    it('Successful response => HttpException OK', async () => {
      const id = '1';
      const response = new HttpException(
        'User with id ' + id + ' removed successfully',
        HttpStatus.OK,
      );

      jest
        .spyOn(userService, 'remove')
        .mockImplementation(async () => response);
      const controller = await userController.remove(id);

      expect(await controller.getStatus()).toBe(200);
      expect(await controller.message).toBe(
        'User with id 1 removed successfully',
      );
      expect(await controller).toEqual(response);
      expect(userService.remove).toHaveBeenCalledTimes(1);
    });

    it('Failed response => HttpException NOT FOUND', async () => {
      const id = '2';
      const response = new HttpException(
        'User id ' + id + ' not found in the database',
        HttpStatus.NOT_FOUND,
      );

      jest
        .spyOn(userService, 'remove')
        .mockImplementation(async () => response);
      const controller = await userController.remove(id);

      expect(await controller.getStatus()).toBe(404);
      expect(await controller.message).toBe(
        'User id 2 not found in the database',
      );
      expect(await controller).toEqual(response);
    });
  });
});
