import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    try {
      super({
        datasources: {
          db: {
            url: config.get('DATABASE_URL'),
          },
        },
      });
    } catch (error) {
      console.error('Error initializing PrismaClient', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  clean() {
    // TODO: clean db
  }
}
