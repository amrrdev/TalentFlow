import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../auth/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_USER_KEY } from '../auth/auth.constants';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwtConfigrations: ConfigType<typeof jwtConfig>,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket, ...args: any[]) {
    const token = this.extractTokenHandshake(client);

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfigrations.secret,
        issuer: this.jwtConfigrations.issuer,
        audience: this.jwtConfigrations.audience,
      });

      client.data[REQUEST_USER_KEY] = payload;
      console.log(`Connected with this client ${client.id}`);
      return true;
    } catch (error) {
      client.emit('error', { message: 'Authentication failed. Invalid or expired token.' });
      client.disconnect();
      return false;
    }
  }

  // TODO: push new messages to the fucking queue
  @SubscribeMessage('newMessage')
  handleNewMessage(
    @ActiveUser('sub') senderId: number,
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data[REQUEST_USER_KEY];
    console.log(`Received message from user ${user.sub}:`, body);
    this.server.emit('replay', body);
  }

  private extractTokenHandshake(client: Socket) {
    const [_, token] = client.handshake.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
