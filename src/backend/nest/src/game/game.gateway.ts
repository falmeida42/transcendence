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
    match: {},
  };
  private gameConfig = {
    width: 580,
    height: 320,
  };
  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('SendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('message') message: string,
  ) {
    const player = this.game.players[client.id];
    this.sendMessage(player, message);
  }

  @SubscribeMessage('CreateRoom')
  createRoom(@ConnectedSocket() client: Socket) {
    client.join(client.id);

    this.game.rooms[client.id] = {
      name: `Sala do ${this.game.players[client.id].name}`,
      player1: client.id,
      player2: undefined,
    };

    this.game.players[client.id].room = client.id;
    this.playersUpdate();
    this.roomsUpdate();
    this.sendMessage(this.game.players[client.id], 'criou uma sala');
    this.logger.log(this.game.rooms);
  }

  @SubscribeMessage('JoinRoom')
  joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
  ) {
    client.join(roomId);

    const position = this.game.rooms[roomId].player1 ? '2' : '1';

    this.game.rooms[roomId][`player${position}`] = client.id;

    this.game.players[client.id].room = roomId;

    const room = this.game.rooms[roomId];
    const gameConfig = this.gameConfig;
    if (room.player1 && room.player2) {
      this.game.match[roomId] = {
        gameConfig,
        player1: { ready: false },
        player2: { ready: false },
        score1: 0,
        score2: 0,
        status: 'START',
      };
      this.gameInProgress(roomId);
    }

    this.playersUpdate();
    this.roomsUpdate();
    this.refreshMatch(roomId);
    this.sendMessage(this.game.players[client.id], 'entrou numa sala');
    this.logger.log(this.game.rooms);
  }

  @SubscribeMessage('LeaveRoom')
  leaveRoomEvent(@ConnectedSocket() client: Socket) {
    this.leaveRoom(client);
    this.playersUpdate();
    this.roomsUpdate();
  }

  @SubscribeMessage('GameLoaded')
  gameLoaded(@ConnectedSocket() client: Socket) {
    const roomId = this.game.players[client.id].room;
    const match = this.game.match[roomId];
    const player =
      'player' + (this.game.rooms[roomId].player1 === client.id ? '1' : '2');

    match[player] = { ready: true };

    if (match.player1.ready && match.player2.ready) {
      match.status = 'PLAY';
      match.ball = {
        width: 5,
        xdirection: 1,
        ydirection: 1,
        xspeed: 2.8,
        yspeed: 2.2,
        x: this.gameConfig.width / 2,
        y: this.gameConfig.height / 2,
      };
    }
  }

  gameInProgress(roomId: string) {
    const match = this.game.match[roomId];
    if (!match || match.status === 'END') return;

    const { ball } = match;
    switch (match.status) {
      case 'PLAY':
        const xpos = ball.x + ball.xspeed * ball.xdirection;
        const ypos = ball.y + ball.yspeed * ball.ydirection;

        ball.x = xpos;
        ball.y = ypos;

        if (xpos > match.gameConfig.width - ball.width || xpos < ball.width)
          ball.xdirection *= -1;
        if (ypos > match.gameConfig.height - ball.width || ypos < ball.width)
          ball.ydirection *= -1;
        if (xpos < ball.width) {
          match.score2++;
        }

        if (xpos > match.gameConfig.width - ball.width) {
          match.score1++;
        }
        break;
    }

    this.refreshMatch(roomId);
    setTimeout(() => this.gameInProgress(roomId), 1000 / 60);
  }

  refreshMatch(roomId: string) {
    this.server.to(roomId).emit('MatchUpdate', this.game.match[roomId] || {});
  }

  roomsUpdate() {
    this.server.emit('RoomsUpdate', this.game.rooms);
  }

  playersUpdate() {
    this.server.emit('PlayerUpdate', this.game.players);
  }

  sendMessage(player: { name: string }, message: string) {
    this.server.emit('ReceiveMessage', `${player.name}: ${message}`);
  }

  leaveRoom(client: Socket) {
    const roomId = this.game.players[client.id].room;
    const room = this.game.rooms[roomId];

    if (room) {
      const match = this.game.match[roomId];

      this.game.players[client.id].room = undefined;

      const playerNumber = room.player1 === client.id ? '1' : '2';
      room[playerNumber] = undefined;

      if (match) {
        match[playerNumber] = undefined;
        match.status = 'END';
        match.message = `O jogador ${
          this.game.players[client.id].name
        } saiu da partida`;
      }

      if (!room.player1 && !room.player2) {
        delete this.game.rooms[roomId];
        if (match) delete this.game.match[roomId];
      }
      this.logger.log(this.game.rooms);
      this.refreshMatch(roomId);
      client.leave(roomId);
    }
  }

  afterInit() {
    this.logger.log('init');
    this.game = {
      players: {},
      rooms: {},
      match: {},
    };
  }

  handleConnection(client: Socket) {
    // this.logger.log(`Client connected ${client.id}`);
    const name = `player_${client.id.substring(0, 5)}`;
    this.game.players[client.id] = { name };
    this.playersUpdate();
    this.roomsUpdate();
    this.server.emit('ReceiveMessage', `${name}: connected!`);
    // this.logger.log(this.game.players);
  }

  handleDisconnect(client: Socket) {
    this.sendMessage(this.game.players[client.id], 'disconnected!');
    if (this.game.players[client.id].room) this.leaveRoom(client);
    delete this.game.players[client.id];
    this.playersUpdate();
    this.roomsUpdate();
    // this.logger.log(`Client disconnected ${client.id}`);
  }
}
