import { Logger } from '@nestjs/common';
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
import { GameService } from './game.service';

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('GameGateway');
  private game = {
    players: {},
  };

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('message') message: string,
  ) {
    this.logger.log(message);
  }

  afterInit(server: Server) {
    this.logger.log('init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected ${client.id}`);
    const name = `player_${client.id.substring(0, 5)}`;
    this.game.players[client.id] = { name };
    this.server.emit('PlayerUpdate', this.game.players);
    this.logger.log(this.game.players);
  }

  handleDisconnect(client: Socket) {
    delete this.game.players[client.id];
    this.server.emit('PlayerUpdate', this.game.players);
    this.logger.log(`Client disconnected ${client.id}`);
  }
}
