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
    rooms: {},
  };

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('message') message: string,
  ) {
    const player = this.game.players[client.id];
    this.server.emit('receiveMessage', `${player.name}: ${message}`);
  }

  @SubscribeMessage('CreateRoom')
  createRoom(@ConnectedSocket() client: Socket) {
    client.join(client.id);

    this.game.rooms[client.id] = {
      player1: client.id,
      player2: undefined,
    };

    this.game.players[client.id].room = client.id;
    this.playersUpdate();
    this.roomsUpdate();
  }

  roomsUpdate() {
    this.server.emit('RoomsUpdate', this.game.rooms);
  }

  playersUpdate() {
    this.server.emit('PlayerUpdate', this.game.players);
  }

  afterInit() {
    this.logger.log('init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected ${client.id}`);
    const name = `player_${client.id.substring(0, 5)}`;
    this.game.players[client.id] = { name };
    this.playersUpdate;
    this.server.emit('receiveMessage', `${name}: connected!`);
    this.logger.log(this.game.players);
  }

  handleDisconnect(client: Socket) {
    this.server.emit(
      'receiveMessage',
      `${this.game.players[client.id].name}: disconnected!`,
    );
    delete this.game.players[client.id];
    this.playersUpdate();
    this.logger.log(`Client disconnected ${client.id}`);
  }
}
