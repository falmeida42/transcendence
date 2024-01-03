import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto';
import { error } from 'console';
import { ChatRoom, ChatType } from '@prisma/client';
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
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId },
      include: {
        friends: true
      }
    })

    JSON.stringify(user)
    return user.friends
  }

  async getChatRooms(userId: string) {
    const userWithChatRooms = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        chatRooms: {
          include: {
            participants: true
          }
        }
      }
    });
  
    if (userWithChatRooms) {
      const modifiedRooms = userWithChatRooms.chatRooms.map(room => {
        if (room.type === 'DIRECT_MESSAGE' as ChatType) {
          //Find the other user in the direct message room
          const directUser = room.participants.find(user => user.id !== userId);
          
          console.log("useeeer", JSON.stringify(directUser))
          return {
            ...room,
            name: directUser.login|| 'User',
            image: directUser.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiJuFZF4sFjZGf3JtXkRDHrtQXNjx3QSRI_NqN2pbWiCXddEPYQ89a0MH91XEp6IwICW8&usqp=CAU',
          };
        }

        // Return other room types unchanged
        return room;
      });

      return modifiedRooms
    }
    return null; // or handle the case when userWithChatRooms is null
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
                sender: true
              }
            }
            
          },
        },
      },
    });
  
    // Extract messages from the chat room
    const messages = user?.chatRooms[0]?.messages || [];
  
    return messages;
  }

  async insertFriend(userId: string, friend: any) {

    await this.prisma.user.update({
        where: { id: userId },
        data: { friends: { connect: { id: friend } } }
      })
  }

  async createRoom(userId: string, roomData: any) {

    try {  
      const result = await this.prisma.chatRoom.create({
        data: {
          id: roomData.id,
          name: roomData.name,
          image: roomData.image,
          type: roomData.type,
          participants: {
            connect: roomData.participants.map((login : string) => ({
              login: login
            }))
          }
        }
      }
      )
    } catch (error) { 

      return error
    }
  }

  async leaveRoom(login: string, roomId: string) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { login: login },
        data: { chatRooms: { disconnect: { id: roomId } } },
      });
  
      if (!updatedUser) {
        // User not found or update failed
        return { success: false, message: "Failed to leave the chat room" };
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
  
      return { success: true, message: "User successfully left the chat room" };
    } catch (error) {
      console.error("Error leaving room:", error.message || error);
      return { success: false, message: "Internal server error" };
    }
  }
  

}
