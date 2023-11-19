import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.getAll();
  }

  async getUserById(id: number) {
    const user = this.prisma.getUserById(id);
    if (!user) {
      return null;
    }
    return user;
  }

  async create() {}

  async delete() {}
}
