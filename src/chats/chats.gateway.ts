import { Chatting } from './models/chattings.model';
import { Socket as SocketModel } from './models/sockets.model';
import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor(
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
  ) {
    this.logger.log('constructor');
  }

  afterInit() {
    // init시 호출되는 함수
    this.logger.log('init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    // 클라이언트와 연결이 되자마자 호출되는 함수
    this.logger.log(`connect: ${socket.id} ${socket.nsp.name}`);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    // 클라이언트와 연결이 끊기자 마자 호출되는 함수
    const user = await this.socketModel.findOne({ id: socket.id });
    if (user) {
      socket.broadcast.emit('disconnect_user', user.username);
      await user.delete();
    }
    this.logger.log(`disconnect: ${socket.id} ${socket.nsp.name}`);
  }

  @SubscribeMessage('new_user') // new_user라는 키로 on(데이터를 받음)
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket, // 이 소켓으로 emit하거나 on할 수 있다.
  ) {
    const exist = await this.socketModel.exists({ username });
    if (exist) {
      username = `${username}_${Math.floor(Math.random() * 100)}`; // 중복 방지
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    } else {
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    }
    // username을 db에 적재할 예정
    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket, // 이 소켓으로 emit하거나 on할 수 있다.
  ) {
    const socketObj = await this.socketModel.findOne({ id: socket.id });
    await this.chattingModel.create({
      user: socketObj, // socketObj를 그대로 넣는다.
      chat: chat,
    });

    socket.broadcast.emit('new_chat', {
      chat,
      username: socketObj.username, // socket.id가 아닌 socketObj.username
    });
  }
}
