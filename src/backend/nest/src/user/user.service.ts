import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto';
import { error } from 'console';
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

  async getFriends(userId: string) {
    const friends = await this.prisma.user.findUnique({ 
      where: { id: userId },
      include: {
        friends: true
      }
    })

    return friends
  }


  async insertFriend(userId: string, friend: any) {

    await this.prisma.user.update({
        where: { id: userId },
        data: { friends: { connect: { id: friend } } }
      })
  }
}
