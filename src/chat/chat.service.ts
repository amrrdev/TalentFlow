import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ChatService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createChat(clientId: number, freelancerId: number) {
    const chatExists = await this.databaseService.chat.findUnique({
      where: {
        clientId_freelancerId: {
          clientId,
          freelancerId,
        },
      },
    });

    if (chatExists) {
      return chatExists;
    }
    const newChat = await this.databaseService.chat.create({
      data: {
        clientId,
        freelancerId,
      },
    });
    return newChat;
  }
}
