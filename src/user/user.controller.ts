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

  // 1️⃣ POST - Create new user
  @Post()
  createUser(@Body() dto: UserDto) {
    return this.userService.createUser(dto);
  }

  // 2️⃣ GET - Get all users
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // 3️⃣ GET - Get one user by ID
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }

  // 4️⃣ GET - Search user by email
  @Get('search/by-email')
  searchUserByEmail(
    @Query('email') email: string,
  ) {
    return this.userService.searchUserByEmail(
      email,
    );
  }

  // 5️⃣ PUT - Replace user (full update)
  @Put(':id')
  replaceUser(
    @Param('id') id: string,
    @Body() dto: UserDto,
  ) {
    return this.userService.replaceUser(+id, dto);
  }

  // 6️⃣ PATCH - Update user (partial update)
  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() dto: Partial<UserDto>,
  ) {
    return this.userService.updateUser(+id, dto);
  }

  // 7️⃣ DELETE - Delete user
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }

  // 8️⃣ GET - Count total users
  @Get('count/all')
  countUsers() {
    return this.userService.countUsers();
  }
}
