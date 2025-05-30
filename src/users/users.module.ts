import { Module } from '@nestjs/common';
import { FreelancersService } from './freelancers/freelancers.service';
import { ClientsService } from './clients/clients.service';
import { DatabaseModule } from '../database/database.module';
import { ClientsController } from './clients/clients.controller';
import { FreelancersController } from './freelancers/freelancers.controller';
import { MailModule } from '../integrations/mail/mail.module';
import { GroqModule } from '../integrations/grok/groq.module';
import { ProposalService } from './freelancers/proposals/proposal.service';
import { ProposalController } from './freelancers/proposals/proposal.controller';
import { ClientProposalService } from './clients/proposal/client-proposal.service';
import { ClientProposalController } from './clients/proposal/client-proposal.controller';
import { QueueModule } from '../integrations/queue/queue.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [DatabaseModule, MailModule, GroqModule, QueueModule, ChatModule],
  providers: [FreelancersService, ClientsService, ProposalService, ClientProposalService],
  controllers: [
    FreelancersController,
    ClientsController,
    ProposalController,
    ClientProposalController,
  ],
})
export class UsersModule {}
