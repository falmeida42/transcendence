import { ChatRoom, ChatType, User } from '@prisma/client';
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger('UserService');

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(userId: string) {
    try {
      return await this.prisma.user.findUnique({ where: { id: userId } });
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Failed to return user with id ${userId}`);
    }
  }

  async getUserByLogin(userLogin: string) {
    return await this.prisma.user.findUnique({ where: { login: userLogin } });
  }

  async create(user: UserDto) {
    return this.prisma.user.create({
      data: user,
    });
  }

  async set2FASecret(id: string, secret: string) {
    try {
      return await this.prisma.user.update({
        where: { id: id },
        data: { twoFactorAuthSecret: secret },
      });
    } catch (error) {
      this.logger.error(error);
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
        twoFactorAuthEnabled: false,
      },
    });
  }

  async is2FAEnabled(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user.twoFactorAuthEnabled;
  }

  async getFriends(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        friends: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Could not find user ith id', userId);
    }
    return user.friends;
  }

  async getChatRooms(userId: string) {
    const userWithChatRooms = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        chatRooms: {
          include: {
            participants: true,
          },
        },
      },
    });

    if (userWithChatRooms) {
      const modifiedRooms = userWithChatRooms.chatRooms.map((room) => {
        if (room.type === ('DIRECT_MESSAGE' as ChatType)) {
          //Find the other user in the direct message room
          const directUser = room.participants.find(
            (user) => user.id !== userId,
          );

          return {
            ...room,
            name: directUser.login || 'User',
            image:
              directUser.image ||
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiJuFZF4sFjZGf3JtXkRDHrtQXNjx3QSRI_NqN2pbWiCXddEPYQ89a0MH91XEp6IwICW8&usqp=CAU',
          };
        }

        // Return other room types unchanged
        return room;
      });

      return modifiedRooms;
    }
    return null; // or handle the case when userWithChatRooms is null
  }

  async getChatRoomById(chatId: string) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatId },
      include: {
        participants: true,
        admins: true,
        owner: true,
      },
    });

    if (chatRoom) {
      return chatRoom;
    }
    return null;
  }

  async updateChatRoomPrivacy(
    chatId: string,
    newType: ChatType,
    newPassword: string,
  ) {
    await this.prisma.chatRoom.update({
      where: { id: chatId },
      data: {
        type: newType,
        password: newPassword,
      },
    });
    return null;
  }

  async getChatRoomsByLogin(username: string) {
    return await this.prisma.user.findUnique({
      where: { login: username },
      include: {
        chatRooms: true,
      },
    });
  }

  async getChatHistory(userId: string, chatId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        chatRooms: {
          where: { id: chatId },
          include: {
            messages: {
              include: {
                sender: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      this.logger.error('No such user: ', userId, chatId);
      throw new NotFoundException('User not found');
    }
    // Extract messages from the chat room
    const messages = user?.chatRooms[0]?.messages || [];

    return messages;
  }

  async insertFriend(userId: string, friend: any) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { friends: { connect: { id: friend } } },
    });
  }

  async createRoom(userId: string, roomData: any) {
    return await this.prisma.chatRoom.create({
      data: {
        id: roomData.id,
        name: roomData.name,
        userId: userId,
        image: roomData.image,
        type: roomData.type,
        password: roomData.password,
        participants: {
          connect: roomData.participants.map((login: string) => ({
            login: login,
          })),
        },
      },
    });
  }

  async leaveRoom(login: string, roomId: string) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { login: login },
        data: { chatRooms: { disconnect: { id: roomId } } },
      });

      if (!updatedUser) {
        // User not found or update failed
        return { success: false, message: 'Failed to leave the chat room' };
      }

      // Check if the chat room becomes empty after the user leaves
      const chatRoom = await this.prisma.chatRoom.findUnique({
        where: { id: roomId },
        include: { participants: true },
      });

      if (chatRoom?.participants.length === 0) {
        // If the chat room is empty, delete it
        await this.prisma.chatRoom.delete({
          where: { id: roomId },
        });
      }

      return { success: true, message: 'User successfully left the chat room' };
    } catch (error) {
      this.logger.error('Error leaving room:', error.message || error);
      return {
        success: false,
        message: 'Internal server error',
        error: error.message,
      };
    }
  }

  async joinRoom(
    login: string,
    roomId: string,
    password: string,
    roomType: string,
  ) {
    try {
      const room = await this.prisma.chatRoom.findUnique({
        where: { id: roomId },
      });

      if (roomType === 'PROTECTED' && room.password !== password) {
        return {
          success: false,
          message: 'Incorrect password for the chat room',
        };
      }

      const updatedUser = await this.prisma.user.update({
        where: { login: login },
        data: { chatRooms: { connect: { id: roomId } } },
      });

      if (!updatedUser) {
        return { success: false, message: 'Failed to join the chat room' };
      }

      return {
        success: true,
        message: 'User successfully joined the chat room',
      };
    } catch (error) {
      this.logger.error('Error joining room:', error.message || error);
      return { success: false, message: 'Internal server error' };
    }
  }

  async getJoinableRooms(userId: string) {
    const rooms = await this.prisma.chatRoom.findMany({
      where: {
        type: { not: 'DIRECT_MESSAGE' as ChatType },
        participants: {
          none: {
            id: userId,
          },
        },
      },
    });
    if (!rooms) {
      this.logger.error('No rooms for user id: ', userId);
      throw new NotFoundException('Could not get joinable rooms');
    }
    return rooms;
  }

  async addMessage(userId: string, chatId: string, content: string) {
    try {
      // Check if the chat room exists
      const chatRoom = await this.prisma.chatRoom.findUnique({
        where: { id: chatId },
      });

      if (!chatRoom) {
        this.logger.error('Chat room not found.', {
          data: { user: userId, chat: chatId, content: content },
        });
        throw new NotFoundException('Chat room not found');
      }

      // Check if the sender user exists
      const sender = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!sender) {
        this.logger.error('Sender not found.', {
          data: { user: userId, chat: chatId, content: content },
        });
        throw new NotFoundException('Sender user not found');
      }

      // Create a new message
      const newMessage = await this.prisma.message.create({
        data: {
          content: content,
          chat_id: chatId,
          sender_id: userId,
          userId: userId,
        },
      });

      return newMessage;
    } catch (error) {
      this.logger.error('Error adding message:', error.message);
      throw new NotImplementedException(error.message);
    }
  }

  async addAdminToChat(login: string, chatId: string, userId: string) {
    // Check if the chat room and user exist

    const requester = await this.prisma.user.findUnique({
      where: { login: login },
    });

    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatId },
      include: {
        admins: true,
        owner: true,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!chatRoom || !user || !requester) {
      throw new NotFoundException('Chat room or user not found.');
    }

    if (requester.id != chatRoom.owner.id) {
      throw new ForbiddenException('User is not the channel owner');
    }

    // Check if the user is already an admin
    const isAdmin = chatRoom.admins.some((admin) => admin.id === userId);

    if (isAdmin) {
      throw new ForbiddenException(
        'User is already an admin in this chat room.',
      );
    }

    // Add the user as an admin
    return await this.prisma.chatRoom.update({
      where: { id: chatId },
      data: {
        admins: {
          connect: { id: userId },
        },
      },
    });
  }

  async getChannelParticipants(channelId: string) {
    const channel = await this.getChatRoomById(channelId);

    if (!channel) {
      throw new NotFoundException('Could not get room');
    }

    const participants = channel.participants.filter((participant) => {
      // Assuming owner and admins are stored in separate arrays within the channel
      const isAdmin = channel.admins.some(
        (admin) => admin.id === participant.id,
      );
      const isOwner = channel.owner.id === participant.id;

      // Include participants who are neither owner nor admin
      return !isAdmin && !isOwner;
    });

    return participants;
  }

  async isAdmin(userId: string, roomId: string) {
    const room = await this.getChatRoomById(roomId);
    if (!room) {
      throw new NotFoundException('No such room: ', roomId);
    }
    return room.admins.some((admin) => admin.id === userId);
  }

  async isOwner(userId: string, roomId: string) {
    const room = await this.getChatRoomById(roomId);
    if (!room) {
      throw new NotFoundException('No such room: ', roomId);
    }
    return room.owner.id === userId;
  }

  async kickUser(id: string, roomId: string) {
    return await this.prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        participants: {
          disconnect: { id },
        },
        admins: {
          disconnect: { id },
        },
      },
      include: {
        participants: true,
      },
    });
  }

  async kickableUsers(user: User, roomId: string) {
    if (await this.isOwner(user.id, roomId)) {
      return this.prisma.chatRoom.findMany({
        where: { id: roomId },
        include: {
          participants: {
            where: { NOT: { id: user.id } },
          },
          admins: {
            where: { NOT: { id: user.id } },
          },
          owner: false,
        },
      });
    } else if (await this.isAdmin(user.id, roomId)) {
      return this.prisma.chatRoom.findMany({
        where: { id: roomId },
        include: {
          participants: {
            where: { NOT: { id: user.id } },
          },
          admins: false,
          owner: false,
        },
      });
    } else {
      return null;
    }
  }
}
