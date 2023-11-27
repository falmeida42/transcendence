import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsGateway } from './rooms.gateway';

@Module({
  providers: [RoomsGateway, RoomsService],
})
export class RoomsModule {}
