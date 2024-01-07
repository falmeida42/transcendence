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

  async getNotFriends(userId: string): Promise<UserDto[] | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        friends: true,
        receivedFriendRequests: {
          where: {
            type: 'PENDING',
          },
          select: {
            requestor: true, // Include the related user data
          },
        },
        sentFriendRequests: {
          where: {
            type: 'PENDING',
          },
          select: {
            requestee: true, // Include the related user data
          },
        },
      },
    });
  
    const friendsIds = user?.friends.map((friend) => friend.id) || [];
    const receivedFriendRequestsIds = user?.receivedFriendRequests.map((request) => request.requestor.id) || [];
    const sentFriendRequestsIds = user?.sentFriendRequests.map((request) => request.requestee.id) || [];
  
    const excludeUserIds = [...friendsIds, ...receivedFriendRequestsIds, ...sentFriendRequestsIds, userId];
  
    // Fetch users who are not friends and don't have pending friend requests
    const notFriends = await this.prisma.user.findMany({
      where: {
        NOT: {
          id: { in: excludeUserIds },
        },
      },
    });
  
    return notFriends || null;
  }
  

  async addFriendRequest(requesterId: string, requesteeId: string): Promise<{ message: string; friendRequest?: any }> {
    try {
      // Check if both users exist
      const requestor = await this.prisma.user.findUnique({
        where: { id: requesterId },
      });
  
      const requestee = await this.prisma.user.findUnique({
        where: { id: requesteeId },
      });
  
      if (!requestor || !requestee) {
        return { message: 'User not found' };
      }
  
      // Check if a friend request already exists
      const existingFriendRequest = await this.prisma.friendRequest.findFirst({
        where: {
          requesterId,
          requesteeId,
          type: 'PENDING', // You might want to include the type in the check
        },
      });
  
      if (existingFriendRequest) {
        return { message: 'Friend request already exists' };
      }
  
      // Create the friend request
      const friendRequest = await this.prisma.friendRequest.create({
        data: {
          type: 'PENDING', // You can set the initial status as needed
          requestor: { connect: { id: requesterId } },
          requestee: { connect: { id: requesteeId } },
        },
      });
  
      return { message: 'Friend request created', friendRequest };
    } catch (error) {
      throw new Error('Error creating friend request');
    }
  }
}  
