import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { ResponseUserDto } from '../dto/response-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepo.save(createUserDto);
      return user;
    } catch (error) {
      return error;
    }
  }

  async getAll() {
    try {
      const users = await this.userRepo.find();
      if (users) {
        const response = plainToInstance(ResponseUserDto, users);
        return response;
      } else {
        return new HttpException(
          'No users were found in the database',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      return error;
    }
  }

  async findById(id: any) {
    try {
      const user = await this.userRepo.findOne({ where: { id: id } });
      if (user) {
        const response = plainToInstance(ResponseUserDto, user);
        return response;
      } else {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      return error;
    }
  }

  async update(id: any, updateUserDto: UpdateUserDto) {
    try {
      const response = await this.userRepo.update(id, updateUserDto);
      if (response.affected) {
        return new HttpException(
          'User with id ' + id + ' updated',
          HttpStatus.OK,
        );
      } else {
        return new HttpException(
          'User id ' + id + ' not found in the database',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      return error;
    }
  }

  async remove(id: any) {
    try {
      const response = await this.userRepo.delete(id);
      if (response.affected) {
        return new HttpException(
          'User with id ' + id + ' removed successfully',
          HttpStatus.OK,
        );
      } else {
        return new HttpException(
          'User id ' + id + ' not found in the database',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      return error;
    }
  }
}
