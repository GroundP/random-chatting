import { ChatsGateway } from './chats.gateway';
import { Module } from '@nestjs/common';

@Module({})
export class ChatsModule {
  providers: [ChatsGateway];
}
