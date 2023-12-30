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
  constructor() {}

  @SubscribeMessage('SendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('message') message: string,
  ) {
    this.sendMessage(this.game.players[client.id], message);
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
        player1: {
          ready: false,
          x: 5,
          y: gameConfig.height / 2 - 40,
          width: 10,
          height: 80,
          speed: 5,
        },
        player2: {
          ready: false,
          x: gameConfig.width - 15,
          y: gameConfig.height / 2 - 40,
          width: 10,
          height: 80,
          speed: 5,
        },
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

    match[player] = { ...match[player], ready: true };

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

  @SubscribeMessage('SendKey')
  sendKey(
    @ConnectedSocket() client: Socket,
    @MessageBody('type') type: string,
    @MessageBody('key') key: string,
  ) {
    const socketId = client.id;
    const player = this.game.players[socketId];
    const roomId = player.room;
    const room = this.game.rooms[roomId];
    const playerNumber = 'player' + (socketId === room.player1 ? 1 : 2);
    const match = this.game.match[roomId];

    const direction =
      type === 'keyup' ? 'STOP' : key.replace('Arrow', '').toUpperCase();

    match[playerNumber] = { ...match[playerNumber], direction };
  }

  gameInProgress(roomId: string) {
    const match = this.game.match[roomId];
    if (!match || match.status === 'END') return;

    switch (match.status) {
      case 'PLAY':
        this.moveBall(match);
        this.movePaddle(match);
        this.checkCollision(match);
        break;
    }

    this.refreshMatch(roomId);

    setTimeout(() => this.gameInProgress(roomId), 1000 / 60);
  }

  moveBall({ ball }) {
    const xpos = ball.x + ball.xspeed * ball.xdirection;
    const ypos = ball.y + ball.yspeed * ball.ydirection;

    ball.x = xpos;
    ball.y = ypos;
  }

  movePaddle(match) {
    [1, 2].forEach((i) => {
      const player = match[`player${i}`];
      switch (player.direction) {
        case 'UP':
          player.y -= player.speed;
          break;
        case 'DOWN':
          player.y += player.speed;
          break;
      }

      if (player.y < 0) {
        player.y = 0;
      } else if (player.y + player.height > match.gameConfig.height) {
        player.y = match.gameConfig.height - player.height;
      }
    });
  }

  checkCollision(match) {
    const { ball, gameConfig } = match;

    if (ball.y > gameConfig.height - ball.width || ball.y < ball.width) {
      ball.ydirection *= -1;
    }

    const { x: bx, y: by, width: br } = ball;

    const playerNumber = bx < gameConfig.width / 2 ? 1 : 2;
    const player = `player${playerNumber}`;
    const { x: rx, y: ry, width: rw, height: rh } = match[player];

    let testX = bx;
    let testY = by;

    if (bx < rx) {
      testX = rx;
    } else if (bx > rx + rw) {
      testX = rx + rw;
    }

    if (by < ry) {
      testY = ry;
    } else if (by > ry + rh) {
      testY = ry + rh;
    }

    const distX = bx - testX;
    const distY = by - testY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance <= br) {
      ball.xdirection *= -1;
      ball.x =
        playerNumber === 1
          ? match[player].x + match[player].width + br
          : match[player].x - br;
    } else if (ball.x < ball.width) {
      match.score2++;
      this.restartMatch(match);
    } else if (ball.x > gameConfig.width - ball.width) {
      match.score1++;
      this.restartMatch(match);
    }
  }

  restartMatch(match) {
    match.ball.xdirection *= -1;
    match.ball.x = match.gameConfig.width / 2;
    match.ball.y = match.gameConfig.height / 2;
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
    const socketId = client.id;
    const roomId = this.game.players[socketId].room;
    const room = this.game.rooms[roomId];

    if (room) {
      const match = this.game.match[roomId];

      this.game.players[socketId].room = undefined;

      const playerNumber = room.player1 === socketId ? '1' : '2';
      room[playerNumber] = undefined;

      if (match) {
        match[playerNumber] = undefined;
        match.status = 'END';
        match.message = `O jogador ${this.game.players[socketId].name} saiu da partida`;
      }

      if (!room.player1 && !room.player2) {
        delete this.game.rooms[roomId];
        if (match) delete this.game.match[roomId];
      }

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
    this.logger.log(`Client connected ${client.id}`);

    const name = 'player_' + client.id.substring(0, 5);
    this.game.players[client.id] = { name };
    this.sendMessage(this.game.players[client.id], 'entrou!');
    this.playersUpdate();
    this.roomsUpdate();
    // this.logger.log(this.game.players);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected ${client.id}`);

    this.sendMessage(this.game.players[client.id], 'disconnected!');
    this.leaveRoom(client);

    delete this.game.players[client.id];

    this.playersUpdate();
    this.roomsUpdate();
  }
}
