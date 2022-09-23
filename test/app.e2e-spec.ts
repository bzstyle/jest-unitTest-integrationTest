import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { User } from '../src/modules/user/entities/user.entity';
import { CreateUserDto } from '../src/modules/user/dto/create-user.dto';
import { TestModule } from '../src/test.module';
import { INestApplication } from '@nestjs/common';
import { UpdateUserDto } from '../src/modules/user/dto/update-user.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('USER CONTROLLER', () => {
    /******** User controller POST /create ************/

    describe('@POST(/create)', () => {
      it('(Create user => Successful response)', () => {
        const data: CreateUserDto = new User();
        data.id = 1;
        data.first_name = 'carlitos';
        data.last_name = 'peres';
        data.identity_number = '26333569';
        data.phone_number = '1165689541';
        data.password = '123456';

        return request(app.getHttpServer())
          .post('/create')
          .send(data)
          .expect(201);
      });

      it('(Create user => Failed response)', () => {
        return request(app.getHttpServer())
          .post('/create')
          .send({})
          .expect(400);
      });

      it('(remove user)', () => {
        return request(app.getHttpServer()).delete('/delete/1').expect(200);
      });
    });

    /******** User controller GET /all ************/

    describe('@GET(/all)', () => {
      it('(Create user)', () => {
        const data: CreateUserDto = new User();
        data.id = 1;
        data.first_name = 'carlitos';
        data.last_name = 'peres';
        data.identity_number = '26333569';
        data.phone_number = '1165689541';
        data.password = '123456';

        return request(app.getHttpServer())
          .post('/create')
          .send(data)
          .expect(201);
      });

      it('(getAll => Successful response)', () => {
        return request(app.getHttpServer())
          .get('/all')
          .expect(200)
          .expect([
            {
              id: 1,
              first_name: 'carlitos',
              last_name: 'peres',
              identity_number: '26333569',
              phone_number: '1165689541',
            },
          ]);
      });

      it('(remove user)', () => {
        return request(app.getHttpServer()).delete('/delete/1').expect(200);
      });
    });

    /******** User controller GET /byId/:id ************/

    describe('@GET(/byId/:id)', () => {
      it('(Create user)', () => {
        const data: CreateUserDto = new User();
        data.id = 1;
        data.first_name = 'carlitos';
        data.last_name = 'peres';
        data.identity_number = '26333569';
        data.phone_number = '1165689541';
        data.password = '123456';

        return request(app.getHttpServer())
          .post('/create')
          .send(data)
          .expect(201);
      });

      it('(getById => Successful response)', () => {
        return request(app.getHttpServer()).get('/byId/1').expect(200).expect({
          id: 1,
          first_name: 'carlitos',
          last_name: 'peres',
          identity_number: '26333569',
          phone_number: '1165689541',
        });
      });
    });

    describe('@GET(/byId/:id)', () => {
      it('(getById => Failed response)', () => {
        return request(app.getHttpServer()).get('/byId/11').expect(200).expect({
          response: 'User not found',
          status: 404,
          message: 'User not found',
          name: 'HttpException',
        });
      });

      it('(remove user)', () => {
        return request(app.getHttpServer()).delete('/delete/1').expect(200); 
      });
    });

    /******** User controller PATCH /update/:id ************/

    describe('@PATCH(/update/:id)', () => {
      it('(Create user)', () => {
        const data: CreateUserDto = new User();
        data.id = 1;
        data.first_name = 'carlitos';
        data.last_name = 'peres';
        data.identity_number = '26333569';
        data.phone_number = '1165689541';
        data.password = '123456';

        return request(app.getHttpServer())
          .post('/create')
          .send(data)
          .expect(201);
      });

      it('(update => Successful response)', () => {
        const data = new UpdateUserDto();
        data.first_name = 'pepito';

        return request(app.getHttpServer())
          .patch('/update/1')
          .send(data)
          .expect(200)
          .expect({
            response: 'User with id 1 updated',
            status: 200,
            message: 'User with id 1 updated',
            name: 'HttpException',
          });
      });
    });

    describe('@PATCH(/update/:id)', () => {
      it('(update => Failed response)', () => {
        const data = new UpdateUserDto();
        data.first_name = 'pepito';

        return request(app.getHttpServer())
          .patch('/update/100')
          .send(data)
          .expect(200)
          .expect({
            response: 'User id 100 not found in the database',
            status: 404,
            message: 'User id 100 not found in the database',
            name: 'HttpException',
          });
      });

      it('(remove user)', () => {
        return request(app.getHttpServer()).delete('/delete/1').expect(200);
      });
    });

    /******** User controller DELETE /delete/:id ************/

    describe('@DELETE(/delete/:id)', () => {
      it('(Create user)', () => {
        const data: CreateUserDto = new User();
        data.id = 1;
        data.first_name = 'carlitos';
        data.last_name = 'peres';
        data.identity_number = '26333569';
        data.phone_number = '1165689541';
        data.password = '123456';

        return request(app.getHttpServer())
          .post('/create')
          .send(data)
          .expect(201);
      });

      it('(remove => Successful response)', () => {
        return request(app.getHttpServer())
          .delete('/delete/1')
          .expect(200)
          .expect({
            response: 'User with id 1 removed successfully',
            status: 200,
            message: 'User with id 1 removed successfully',
            name: 'HttpException',
          });
      });
    });

    describe('@DELETE(/delete/:id)', () => {
      it('(remove => Failed response)', () => {
        return request(app.getHttpServer())
          .delete('/delete/30')
          .expect(200)
          .expect({
            response: 'User id 30 not found in the database',
            status: 404,
            message: 'User id 30 not found in the database',
            name: 'HttpException',
          });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
