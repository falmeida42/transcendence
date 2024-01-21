// chat.gateway.ts

import { Body, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { UserStatus } from './User';

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*' },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private userService: UserService) {}

  @WebSocketServer()
  private io: Server;

  private logger: Logger = new Logger('ChatGateway');
  private users = [];

  afterInit(server: Server) {
    this.io = server;
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket): void {}

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected ${client.id}`);

    const existingUserIndex = this.users.findIndex(
      (user) => user.id === client.id,
    );

    if (existingUserIndex !== -1) {
      this.users.splice(existingUserIndex, 1); // Remove 1 element at the found index
      this.io.emit('getUsersConnected', this.users); // Update the connected users list
    }
  }

  @SubscribeMessage('userConnected')
  async handleUserConnected(client: Socket, payload: any): Promise<void> {
    this.logger.log(`New user connected ${payload.socketId}: ${payload.id}`);
    if (!payload.id) {
      return;
    }
    const user = await this.userService.getUserById(payload.id);

    if (!user) return;

    const existingUserIndex = this.users.findIndex(
      (user) => user.userId === payload.id,
    );

    if (user) {
      user.chatRooms.forEach((room) => {
        client.join(room.id);
      });
    }

    // console.log('user connected');
    if (existingUserIndex !== -1) {
      // User with the same username already exists, update the data
      this.users[existingUserIndex] = {
        id: payload.socketId,
        userId: payload.id,
        username: user.username,
        userStatus: UserStatus.ONLINE,
      };
    } else {
      // User with the username doesn't exist, add a new user
      this.users.push({
        id: payload.socketId,
        userId: payload.id,
        username: user.username,
        userStatus: UserStatus.ONLINE,
      });
    }

    this.io.emit('getUsersConnected', this.users);
  }

  @SubscribeMessage('joinAllRooms')
  async joinAllRooms(
    @ConnectedSocket() client: Socket,
    @Body('id') id: string,
  ): Promise<void> {
    if (!id) return;

    const user = await this.userService.getUserById(id);

    if (user) {
      user.chatRooms.forEach((room) => {
        client.join(room.id);
      });
    }
  }

  @SubscribeMessage('kickFromRoom')
  async kickFromRoom(
    client: Socket,
    @Body('id') id?: string,
    @Body('roomId') roomId?: string,
  ): Promise<void> {
    const userKicked = await this.userService.getUserById(id);
    if (!userKicked) {
      return;
    }
    const existingUserIndex = this.users.findIndex(
      (user) => user.id === userKicked.id,
    );

    if (existingUserIndex !== -1) {
      this.users[existingUserIndex].emit('closeRoom');
      this.users[existingUserIndex].leave(roomId);
      this.io.emit('UpdateRooms');
    }
  }

  @SubscribeMessage('messageToServer')
  async handleMessage(client: Socket, payload: any) {
    this.logger.debug('message: ', JSON.stringify(payload));
    if (!payload || !payload.senderId) {
      return;
    }
    const user = await this.userService.getUserById(payload.senderId);
    if (!user) {
      return 'user not found';
    }

    const channel = await this.userService.getChatRoomById(payload.to);

    if (!channel) {
      return 'channel not found';
    }

    const is_muted = await this.userService.isUserMutedInRoom(
      user.id,
      payload.to,
    );

    if (is_muted) {
      return 'user is muted';
    }

    const is_participant = await this.userService.isUserInRoom(
      user.id,
      payload.to,
    );

    if (!is_participant) {
      return 'user is not in chatRoom';
    }

    const is_banned = await this.userService.isBanned(user.login, channel.id);

    if (is_banned) {
      return 'user banned';
    }

    const res = await this.userService.addMessage(
      user.id,
      channel.id,
      payload.message,
      payload.type,
    );
    this.io.to(payload.to).emit('messageToClient', {
      id: res.id,
      channelId: payload.to,
      message: payload.message,
      senderId: payload.senderId,
      sender: payload.sender,
      senderImage: payload.senderImage,
      type: payload.type,
    });
  }

  @SubscribeMessage('joinChannel')
  joinChannel(client: Socket, payload: any): void {
    client.join(payload);

    if (payload != null) {
      client.emit('availableRooms', {
        name: payload,
        image:
          'data:image/png;base64,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',
      });
    }
  }

  @SubscribeMessage('updateStatus')
  async updateStatus(@Body('id') id: string, @Body('status') status: number) {
    const userReceived = await this.userService.getUserById(id);

    if (!userReceived) {
      return 'User not found';
    }

    if (!status || status < 0 || status > 2) {
      return 'wrong status';
    }

    const existingUserIndex = this.users.findIndex(
      (user) => user.userId === userReceived.id,
    );

    if (existingUserIndex !== -1) {
      // User with the same username already exists, update the data
      if (status !== 1) {
        await this.userService.deleteAllInvites(userReceived.id);
      }
      this.users[existingUserIndex] = {
        ...this.users[existingUserIndex],
        userStatus: status,
      };

      // console.log('user: ', JSON.stringify(this.users));
    }

    this.io.emit('getUsersConnected', this.users);
  }

  @SubscribeMessage('AddChannel')
  addChannel(client: Socket, @MessageBody('id') id: string) {
    this.io.emit('UpdateRooms');
  }

  @SubscribeMessage('inviteToGame')
  inviteToGame(client: Socket, @MessageBody('login') login: string) {
    this.io.emit('inviteToGame');
  }

  @SubscribeMessage('deleteMessage')
  async deleteMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('messageId') messageId: string,
  ) {
    if (!messageId) return;
    this.logger.debug(messageId);
    await this.userService.deleteMessage(messageId);
    this.io.emit('cu');
  }

  @SubscribeMessage('enterGame')
  enterGame(
    @ConnectedSocket() client: Socket,
    @MessageBody('player1Id') player1: string,
    @MessageBody('player2Id') player2: string,
  ) {
    if (!player1 || !player2) return;
    this.logger.debug('p1', player1, 'p2', player2);

    const existingPlayer1Index = this.users.findIndex(
      (user) => user.userId === player1,
    );

    const existingPlayer2Index = this.users.findIndex(
      (user) => user.userId === player2,
    );

    if (existingPlayer1Index === -1 || existingPlayer2Index === -1) {
      return;
    }
    this.io
      .to(this.users[existingPlayer1Index].id)
      .to(this.users[existingPlayer2Index].id)
      .emit('joinGame');
  }
}
