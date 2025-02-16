import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { FreelancersService } from './freelancers.service';
import { ActiveUser } from '../../auth/decorators/active-user.decorator';
import { CreateBidDto } from './dto/create-bid.dto';
import { Role } from '../enum/role.enum';
import { Roles } from '../../auth/authorization/decorators/role.decorator';
import { UpdateBidDto } from './dto/update-bid.dto';

@Controller('freelancers/bids')
@Roles(Role.Freelancer)
export class FreelancersController {
  constructor(private readonly freelancersService: FreelancersService) {}

  @Post(':projectId')
  createBid(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createBidDto: CreateBidDto,
  ) {
    return this.freelancersService.createBid(freelancerId, projectId, createBidDto);
  }

  @Patch(':projectId')
  updateBid(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() updateBidDto: UpdateBidDto,
  ) {
    return this.freelancersService.updateBid(freelancerId, projectId, updateBidDto);
  }

  @Delete(':projectId')
  deleteBid(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.freelancersService.deleteBid(freelancerId, projectId);
  }

  @Get(':projectId')
  getFreelancerBid(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.freelancersService.getFreelancerBid(freelancerId, projectId);
  }

  @Post(':projectId/suggestions')
  @HttpCode(HttpStatus.OK)
  getSuggestions(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createBidDto: CreateBidDto,
  ) {
    return this.freelancersService.getSuggestions(projectId, createBidDto);
  }
}
