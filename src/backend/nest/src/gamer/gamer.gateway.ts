// import { Logger } from '@nestjs/common';
// import {
//   ConnectedSocket,
//   MessageBody,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   OnGatewayInit,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import User from './User';

// @WebSocketGateway({
//   namespace: '/gamer',
//   cors: {
//     origin: 'http://localhost:5173',
//     credentials: true,
//   },
// })
// export class GamerGateway
//   implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
// {
//   @WebSocketServer()
//   server: Server;
//   private logger: Logger = new Logger('GamerGateway');
//   private users: User[] = [];

//   afterInit() {
//     this.logger.log('init');
//   }

//   handleConnection(client: Socket) {
//     this.logger.log(`Client connected ${client.id}`);
//   }

//   handleDisconnect(client: Socket) {
//     this.logger.log(`Client disconnected ${client.id}`);
//   }
// }
