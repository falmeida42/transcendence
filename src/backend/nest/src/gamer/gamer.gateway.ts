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
import { PrismaService } from 'src/prisma/prisma.service';
import { Match } from './utils/Match';
import { Player } from './utils/Player';
import Queue from './utils/Queue';
import { Room } from './utils/Room';
import { gameConfig } from './utils/gameConfig';

@WebSocketGateway({
  namespace: '/gamer',
  cors: true,
})
export class GamerGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('GamerGateway');

  constructor(private prisma: PrismaService) {}

  // data
  private players: Record<string, Player> = {};
  private rooms: Record<string, Room> = {};
  private match: Record<string, Match> = {};
  private queue: Queue<Socket> = new Queue();
  private queueTimeOutID: NodeJS.Timeout | undefined;

  afterInit() {
    this.logger.log('init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected ${client.id}`);
    this.players[client.id] = { socket: client.id, onQueue: false };
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected ${client.id}`);
    const player = this.players[client.id];
    if (player) {
      console.log(`${player.name} desconectou`);

      const playerId = client.id;
      const timerId = setTimeout(() => {
        this.removePlayer(playerId);
      }, 5000);
      this.players[playerId].disconnectedId = timerId;
    }

    delete this.players[client.id];
  }

  @SubscribeMessage('Login')
  handleLogin(
    @ConnectedSocket() client: Socket,
    @MessageBody('name') name: string,
  ) {
    this.logger.log(`Client ${client.id} logged in as ${name}`);
    this.players[client.id].name = name;
    this.logger.log(this.players);
  }

  @SubscribeMessage('CreateRoom')
  createRoomAgainstAi(
    @ConnectedSocket() client: Socket,
    @MessageBody('againstAi') againstAi: boolean,
  ) {
    client.join(client.id);
    this.logger.log(`Client ${client.id} created a room against AI`);

    this.rooms[client.id] = {
      id: client.id,
      player1: this.players[client.id].socket,
      player2: 'AI',
      againstAi,
    };
    this.players[client.id].room = client.id;
    this.match[this.players[client.id].room] = this.createMatch(
      client.id,
      againstAi,
    );
    if (againstAi) this.runGame(this.players[client.id].room, againstAi);

    client.emit('RoomCreated', this.rooms[client.id]);
  }

  @SubscribeMessage('GameLoaded')
  gameLoaded(@ConnectedSocket() client: Socket) {
    const player = this.players[client.id];
    if (!player) return;

    const roomId = player.room;
    const room = this.rooms[roomId];

    if (!room) return;

    const match = this.match[roomId];
    if (!match) return;
    if (room.player1 === player.socket) match.player1.ready = true;
    else match.player2.ready = true;
    if (room.againstAi) {
      match.status = 'PLAY';
    } else {
      if (
        match.player1.ready &&
        match.player2.ready &&
        match.status !== 'PLAY'
      ) {
        match.status = 'PLAY';
      }
    }
  }

  @SubscribeMessage('SendKey')
  sendKey(
    @ConnectedSocket() client: Socket,
    @MessageBody('type') type: string,
    @MessageBody('key') key: string,
  ) {
    const socketId = client.id;
    const player = this.players[socketId];
    const roomId = player.room;
    const room = this.rooms[roomId];
    const playerNumber = 'player' + (socketId === room.player1 ? 1 : 2);
    const match = this.match[roomId];

    const direction = type === 'keyup' ? 'STOP' : key;
    if (playerNumber === 'player2')
      this.logger.debug(`player ${JSON.stringify(player)}`);
    match[playerNumber].direction = direction;
  }

  @SubscribeMessage('JoinQueue')
  joinQueue(@ConnectedSocket() client: Socket) {
    const player = this.players[client.id];

    if (player.onQueue) return;
    this.queue.enqueue(client);
    player.onQueue = true;
    client.emit('QueueJoined');
    this.logger.log(`Client ${client.id} joined the queue`);
    this.queueMatch();
  }

  @SubscribeMessage('LeaveQueue')
  leaveQueue(@ConnectedSocket() client: Socket) {
    const player = this.players[client.id];

    if (!player.onQueue) return;
    this.queue.dequeue();
    player.onQueue = false;
    client.emit('QueueLeft');
    this.logger.log(`Client ${client.id} left the queue`);
  }

  @SubscribeMessage('PauseMatch')
  pauseMatch(@ConnectedSocket() client: Socket) {
    const socketId = client.id;
    const player = this.players[socketId];
    const roomId = player.room;
    const match = this.match[roomId];
    match.player1.ready = false;
    match.player2.ready = false;

    if (match.status === 'PLAY') match.status = 'PAUSE';
  }

  removePlayer(playerId: string) {
    this.leaveRoom(playerId);
    delete this.players[playerId];
  }

  leaveRoom(socketId: string) {
    const player = this.players[socketId];
    const roomId = player && player.room;
    const room = this.rooms[roomId];

    if (room) {
      const match = this.match[roomId];

      player.room = undefined;

      const playerNumber = 'player' + (socketId === room.player1 ? 1 : 2);
      room[playerNumber] = undefined;

      if (match) {
        match[playerNumber] = undefined;

        if (match.status !== 'END') match.status = 'END';
      }

      if (!room.player1 && !room.player2) {
        delete this.rooms[roomId];
        if (match) delete this.match[roomId];
      }
    }
  }

  createMatch(player1Id: string, againstAi: boolean, player2Id?: string) {
    const match: Match = {
      gameConfig,
      player1: {
        id: player1Id,
        name: this.players[player1Id].name,
        ready: false,
        x: 5,
        y: gameConfig.height / 2 - 50,
        height: 100,
        width: 15,
        speed: 10,
        direction: 'STOP',
      },
      player2: {
        id: againstAi ? 'AI' : player2Id,
        name: againstAi ? 'AI' : this.players[player2Id].name,
        ready: false,
        x: gameConfig.width - 20,
        y: gameConfig.height / 2 - 50,
        height: 100,
        width: 15,
        speed: 10,
        direction: 'STOP',
      },
      ball: {
        x: gameConfig.width / 2,
        y: gameConfig.height / 2,
        radius: 10,
        x_speed: 10,
        y_speed: 10,
        x_direction: 1,
        y_direction: 1,
      },
      score1: 0,
      score2: 0,
      status: 'START',
    };
    this.match[this.players[player1Id].room] = match;
    return match;
  }

  runGame(roomId: string, againstAi: boolean) {
    const match = this.match[roomId];
    if (!match || match.status === 'END') return;

    if (match.status === 'PLAY') {
      this.moveBall(match);
      if (againstAi && match.ball.x_direction == 1) this.moveAi(match);
      this.movePaddle(match);
      this.checkCollision(match);
    }

    this.refreshGame(roomId);

    setTimeout(() => {
      this.runGame(roomId, againstAi);
    }, 1000 / 30);
  }

  refreshGame(roomId: string) {
    const match = this.match[roomId];
    this.server.to(roomId).emit('MatchRefresh', match);
  }

  moveBall(match: Match) {
    const { ball } = match;
    const xpos = ball.x + ball.x_speed * ball.x_direction;
    const ypos = ball.y + ball.y_speed * ball.y_direction;

    ball.x = xpos;
    ball.y = ypos;
  }

  movePaddle(match: Match) {
    [1, 2].forEach((i) => {
      const player = match[`player${i}`];

      switch (player.direction) {
        case 'ArrowUp':
          player.y -= player.speed;
          break;
        case 'ArrowDown':
          player.y += player.speed;
          break;
      }

      if (player.y < 0) {
        player.y = 0;
        return;
      }
      if (player.y > match.gameConfig.height - player.height) {
        player.y = match.gameConfig.height - player.height;
        return;
      }
    });
  }

  moveAi(match: Match) {
    if (match.ball.y < match.player2.y) {
      match.player2.direction = 'ArrowUp';
    } else if (match.ball.y > match.player2.y + match.player2.height) {
      match.player2.direction = 'ArrowDown';
    } else match.player2.direction = 'STOP';
  }

  checkCollision(match: Match) {
    const { ball, gameConfig } = match;

    if (ball.y > gameConfig.height - ball.radius) {
      ball.y = gameConfig.height - ball.radius * 2;
      ball.y_direction = -1;
    }

    if (ball.y < ball.radius) {
      ball.y = ball.radius * 2;
      ball.y_direction = 1;
    }

    const { x: bx, y: by, radius: br } = ball;

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
    const distance = Math.sqrt(distX * distX + distY * distY); // verificando se a bola colidiu com o player
    if (distance <= br) {
      ball.x_direction *= -1;
      ball.x =
        playerNumber === 1
          ? match[player].x + match[player].width + br
          : match[player].x - br;

      // calculando o angulo de rebote tendo como base a posição da colisão da bola com o player
      const quarterTop = by < ry + rh / 4;
      const quarterBottom = by > ry + rh - rh / 4;
      const halfTop = by < ry + rh / 2;
      const halfBottom = by > ry + rh - rh / 2;

      if (quarterTop || quarterBottom) {
        ball.y_speed += 0.15;
        ball.x_speed -= 0.15;

        ball.y_direction = quarterBottom ? 1 : -1;
      } else if (halfTop || halfBottom) {
        ball.y_speed += 0.05;
        ball.x_speed -= 0.05;
      }
      ball.x_speed *= 1.1;
      ball.x_speed = Math.min(ball.x_speed, 25);
    } else if (ball.x < ball.radius) {
      match.score2++;
      ball.x_direction *= -1;
      this.restartBall(match);
    } else if (ball.x > gameConfig.width - ball.radius) {
      match.score1++;
      ball.x_direction *= -1;
      this.restartBall(match);
    }
  }

  async restartBall(match: Match, roomId?: string) {
    const { ball, gameConfig } = match;
    ball.x = gameConfig.width / 2;
    ball.y = gameConfig.height / 2;
    ball.x_speed = 10;
    ball.y_speed = 10;

    if (
      match.score1 === match.gameConfig.maxScore ||
      match.score2 === match.gameConfig.maxScore
    ) {
      this.logger.log('Game Over');
      match.status = 'END';
      await this.saveMatchOnDatabase(match);
      this.server.to(roomId).emit('GameOver', match);
    }
  }

  async saveMatchOnDatabase(match: Match) {
    try {
      const user1Id = await this.prisma.user.findUniqueOrThrow({
        where: {
          login: match.player1.name,
        },
      });
      const user2Id = await this.prisma.user.findFirstOrThrow({
        where: {
          login: match.player2.name,
        },
      });
      const winnerScore =
        match.score1 === match.gameConfig.maxScore
          ? match.score1
          : match.score2;
      const loserScore =
        match.score1 < match.score2 ? match.score1 : match.score2;
      const matchCreated = await this.prisma.match.create({
        data: {
          playerwinScore: winnerScore,
          playerlosScore: loserScore,
          userwinId: winnerScore === match.score1 ? user1Id.id : user2Id.id,
          userlosId: loserScore === match.score1 ? user1Id.id : user2Id.id,
        },
      });
      this.logger.log(matchCreated);
    } catch (e) {
      this.logger.log(e);
    }
  }

  queueMatch() {
    if (this.queue.size() < 2) {
      clearTimeout(this.queueTimeOutID);
      return;
    }
    this.queueTimeOutID = setTimeout(() => this.queueMatch(), 1000);
    const player1 = this.queue.dequeue();
    const player2 = this.queue.dequeue();

    this.createRoomFromQueue(player1, player2);
  }

  createRoomFromQueue(socket1: Socket, socket2: Socket) {
    const roomId = socket1.id + socket1.id;
    const player1 = this.players[socket1.id];
    const player2 = this.players[socket2.id];

    this.logger.log(`${player1.name} vs ${player2.name} in room }`);
    socket1.join(roomId);
    socket2.join(roomId);

    this.rooms[roomId] = {
      id: roomId,
      player1: socket1.id,
      player2: socket2.id,
      againstAi: false,
    };

    player1.room = roomId;
    player2.room = roomId;

    this.match[roomId] = this.createMatch(socket1.id, false, socket2.id);

    socket1.emit('RoomCreated', this.rooms[roomId]);
    socket2.emit('RoomCreated', this.rooms[roomId]);
    this.runGame(roomId, false);
    this.logger.log(`Room ${roomId} created`);
  }
}
