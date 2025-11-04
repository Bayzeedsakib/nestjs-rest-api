import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const userResponseDto = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  createdAt: true,
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: UserDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
        select: userResponseDto,
      });
      return {
        message: 'User created successfully',
        user,
      };
    } catch (error) {
      if (
        error instanceof
          PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException(
          'Email already exists',
        );
      }
      throw error;
    }
  }

  // 2️⃣ Get all users
  async getAllUsers() {
    const users = await this.prisma.user.findMany(
      {
        select: userResponseDto,
      },
    );
    return {
      message: 'All users fetched successfully',
      users,
    };
  }

  // 3️⃣ Get user by ID
  async getUserById(id: number) {
    const user =
      await this.prisma.user.findUnique({
        where: { id },
        select: userResponseDto,
      });
    if (!user)
      throw new ForbiddenException(
        'User not found',
      );
    return {
      message: `User with ID ${id} fetched`,
      user,
    };
  }

  // 4️⃣ Search user by email
  async searchUserByEmail(email: string) {
    const user =
      await this.prisma.user.findUnique({
        where: { email },
        select: userResponseDto,
      });
    if (!user)
      throw new NotFoundException(
        'User not found',
      );
    return {
      message: `User found with email ${email}`,
      user,
    };
  }

  // 5️⃣ Replace (PUT)
  async replaceUser(id: number, dto: UserDto) {
    const hash = await argon.hash(dto.password);
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email,
        hash,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
      select: userResponseDto,
    });
    return {
      message: `User with ID ${id} replaced successfully`,
      user,
    };
  }

  // 6️⃣ Update (PATCH)
  async updateUser(
    id: number,
    dto: Partial<UserDto>,
  ) {
    const updatedData: any = { ...dto };
    if (dto.password) {
      updatedData.hash = await argon.hash(
        dto.password,
      );
      delete updatedData.password;
    }
    const user = await this.prisma.user.update({
      where: { id },
      data: updatedData,
      select: userResponseDto,
    });
    return {
      message: `User with ID ${id} updated successfully`,
      user,
    };
  }

  // 7️⃣ Delete
  async deleteUser(id: number) {
    await this.prisma.user.delete({
      where: { id },
    });
    return {
      message: `User with ID ${id} deleted successfully`,
    };
  }

  // 8️⃣ Count users
  async countUsers() {
    const count = await this.prisma.user.count();
    return {
      message: 'Total users count',
      count,
    };
  }
}
