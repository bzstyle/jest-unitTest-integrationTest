import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @UsePipes(ValidationPipe)
  @ApiOperation({ description: 'create user' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get('/all')
  @ApiOperation({ description: 'find all users' })
  async findAll() {
    return await this.userService.getAll();
  }

  @Get('/byId/:id')
  @ApiOperation({ description: 'find by id user' })
  async getById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Patch('/update/:id')
  @ApiOperation({ description: 'update user' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete('/delete/:id')
  @ApiOperation({ description: 'delete user' })
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }
}
