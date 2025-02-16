import { Module } from '@nestjs/common';
import { FreelancersService } from './freelancers/freelancers.service';
import { ClientsService } from './clients/clients.service';
import { DatabaseModule } from '../database/database.module';
import { ClientsController } from './clients/clients.controller';
import { FreelancersController } from './freelancers/freelancers.controller';
import { OpenAiModule } from '../integrations/open-ai/open-ai.module';

@Module({
  imports: [DatabaseModule, OpenAiModule],
  providers: [FreelancersService, ClientsService],
  controllers: [FreelancersController, ClientsController],
})
export class UsersModule {}
