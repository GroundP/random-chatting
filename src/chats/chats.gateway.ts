import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatsGateway {
  @SubscribeMessage('new_user') // new_user라는 키로 on(데이터를 받음)
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket, // 이 소켓으로 emit하거나 on할 수 있다.
  ) {
    console.log(username);
  }
}
