import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // POST - Create new user
  @Post()
  createUser(@Body() dto: UserDto) {
    return this.userService.createUser(dto);
  }

  // GET - Get all users
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // GET - Get one user by ID
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }

  // GET - Search user by email
  @Get('search/by-email')
  searchUserByEmail(
    @Query('email') email: string,
  ) {
    return this.userService.searchUserByEmail(
      email,
    );
  }

  // PUT - Replace user (full update)
  @Put(':id')
  replaceUser(
    @Param('id') id: string,
    @Body() dto: UserDto,
  ) {
    return this.userService.replaceUser(+id, dto);
  }

  // PATCH - Update user (partial update)
  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() dto: Partial<UserDto>,
  ) {
    return this.userService.updateUser(+id, dto);
  }

  // DELETE - Delete user
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }

  // GET - Count total users
  @Get('count/all')
  countUsers() {
    return this.userService.countUsers();
  }
}
