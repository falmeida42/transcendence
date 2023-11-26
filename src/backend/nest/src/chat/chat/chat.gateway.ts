import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Payload } from '@prisma/client/runtime/library';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({namespace: 'chat', cors: {origin: 'http://localhost:5173', credentials: true}})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() 
  server: Server;
  
  private logger: Logger = new Logger('AppGateway');



  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: string): void {
    this.logger.log(`message received ${JSON.stringify(payload)}`)
    this.server.emit('messageToClient', payload, client.id)
  }

  afterInit(server: Server) {
    this.logger.log('Server initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected ${client.id}`)
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected ${client.id}`)
  }
}