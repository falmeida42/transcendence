import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Payload } from '@prisma/client/runtime/library';
import { Server, Socket } from 'socket.io';
import { User } from './User';
import { Room } from './Room'
import { Message } from './Message';

@WebSocketGateway({namespace: '/', cors: {origin: 'http://localhost:5173', credentials: true}})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() 
  server: Server;
  
  private users : Set<User> = new Set();
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: Payload<Message>): void {
    this.logger.log(`message received ${JSON.stringify(payload)}`)
    this.server.emit('messageToClient', payload)
  }

  @SubscribeMessage('clientConnected')
  handleClientConnected(client: Socket, payload: Payload<User>): void {
    this.users.add(payload)
    this.logger.log(`${payload?.username} ${payload.room} = ${this.users.has(payload)}`)
  }

  afterInit(server: Server) {
    this.logger.log('Server initialized');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected ${client.id}`)
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected ${client.id}`)
  }
}