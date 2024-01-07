import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(userId: string): Promise<UserDto | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getUserByLogin(userLogin: string): Promise<UserDto | null> {
    return this.prisma.user.findUnique({ where: { login: userLogin } });
  }

  async getAll(): Promise<UserDto[] | null> {
    return this.prisma.user.findMany();
  }
  
  async getFriends(userId: string): Promise<UserDto[] | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }, // Assuming id is a numeric type
      include: { friends: true },
    });
  
    return user?.friends || null;
  }
  

  async create(user: UserDto) {
    return this.prisma.user.create({
      data: user,
    });
  }

  async delete(login: string) {
    const user = await this.prisma.user.findUnique({ where: { login } });

    if (!user) {
      return 'User not found';
    }

    return this.prisma.user.delete({ where: { login } });
  }
}
