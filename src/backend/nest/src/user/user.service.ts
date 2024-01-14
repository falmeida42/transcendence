import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger('UserService');

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserById(userId: string): Promise<UserDto | null> {
    try {
      return await this.prisma.user.findUnique({ where: { id: userId } });
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Failed to return user with id ${userId}`);
    }
  }

  async getUserByLogin(userLogin: string): Promise<UserDto | null> {
    return await this.prisma.user.findUnique({ where: { login: userLogin } });
  }

  async updateUserById(userId: string, userData: Partial<UserDto>): Promise<UserDto | null> {
  // Filter out the empty values from userData
  const nonEmptyData: Record<string, any> = {};
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      nonEmptyData[key] = value;
    }
  });

  if (Object.keys(nonEmptyData).length === 0) {
    // If there are no non-empty values, return null or handle accordingly
    return null;
  }
    return await this.prisma.user.update({
      where: { id: userId },
      data: nonEmptyData,
    });
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
    return await this.prisma.user.create({
      data: user,
    });
    //return user?.friends || null;
  }

  async getFriendRequests(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { 
        receivedFriendRequests: {
          where: {
            type: "PENDING",
          },
          include: { requestor: true },
        },
      },
    });
  
    return user?.receivedFriendRequests;
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
  

      const friends = await this.getFriends(requesterId);

      // Check if the requestee is already a friend
      if (friends.some((friend) => friend.id === requesteeId)) {
       return { message: 'Requestee is already a friend' };
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
          type: 'PENDING',
          requestor: { connect: { id: requesterId } },
          requestee: { connect: { id: requesteeId } },
        },
      });
  
      return { message: 'Friend request created', friendRequest };
    } catch (error) {
      throw new Error('Error creating friend request');
    }
  }

  async handleFriendRequest(requesterId: string, requesteeId: string, id: string, type: string) {
    try {
      if (type === "ACCEPTED")
      {
        const friendRequest = await this.prisma.friendRequest.update({
          where: {
            id: id,
          },
          data: {
            type: 'ACCEPTED',
          },
        });
  
        await this.prisma.user.update({
          where: {
            id: requesteeId,
          },
          data: {
            friends: {
              connect: { id: requesterId }
            },
          },
        });
        return { message: 'Friend request accepted', friendRequest };
      }
      else
      {
        const friendRequest = await this.prisma.friendRequest.update({
          where: {
            id: id,
          },
          data: {
            type: 'CANCELED',
          },
        });
  
        return { message: 'Friend request denied', friendRequest };
      }
  
    } catch (error) {
      throw new Error('Error accepting friend request');
    }
  }

  async blockUser(id: string, blockedId: string) {
    try {

    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: blockedId,
      },
    });

    if (!existingUser) {
      return { message: 'User with blockedId not found:', blockedId };
    }

    const isAlreadyBlocked = await this.prisma.user.findFirst({
      where: {
        id: blockedId,
        blockedBy: {
          some: {
            id: id,
          },
        },
      },
    });

    if (isAlreadyBlocked) {
      return { message: 'User is already blocked:', blockedId };
    }

    await this.prisma.user.update({
      where: {
        id: blockedId,
      },
      data: {
        blockedBy: {
          connect: { id: id },
        },
      },
    });
   
    } catch (error) {
      throw new Error('Error blocking user');
    }
  }
  
  async set2FASecret(id: string, secret: string) {
    try {
      return await this.prisma.user.update({
        where: { id: id },
        data: { twoFactorAuthSecret: secret },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async set2FAOn(id: string) {
    return await this.prisma.user.update({
      where: { id: id },
      data: { twoFactorAuthEnabled: true },
    });
  }

  async set2FAOff(id: string) {
    return await this.prisma.user.update({
      where: { id: id },
      data: {
        twoFactorAuthEnabled: false
      },
    });
  }

  async is2FAEnabled(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      throw new ForbiddenException('User does not exist');
    }
    return user.twoFactorAuthEnabled;
  }

  async getBlockableUsers(id: string) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          id: {
            not: id,
          },
          blockedBy: {
            none: {
              id: id,
            },
          },
        },
      });
  
      return users;
    } catch (error) {
      throw new Error('Error fetching users');
    }
  }

  
}

