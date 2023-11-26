import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42') {
    constructor()
}