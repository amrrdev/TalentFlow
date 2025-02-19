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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Freelancer Bids')
@ApiBearerAuth()
@Roles(Role.Freelancer)
@Controller('freelancers/bids')
export class FreelancersController {
  constructor(private readonly freelancersService: FreelancersService) {}

  @Post(':projectId')
  @ApiOperation({ summary: 'Create a bid for a project' })
  @ApiResponse({ status: 201, description: 'Bid created successfully' })
  createBid(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createBidDto: CreateBidDto,
  ) {
    return this.freelancersService.createBid(freelancerId, projectId, createBidDto);
  }

  @Patch(':projectId')
  @ApiOperation({ summary: 'Update an existing bid' })
  @ApiResponse({ status: 200, description: 'Bid updated successfully' })
  updateBid(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() updateBidDto: UpdateBidDto,
  ) {
    return this.freelancersService.updateBid(freelancerId, projectId, updateBidDto);
  }

  @Delete(':projectId')
  @ApiOperation({ summary: 'Delete a freelancer bid' })
  @ApiResponse({ status: 200, description: 'Bid deleted successfully' })
  deleteBid(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.freelancersService.deleteBid(freelancerId, projectId);
  }

  @Get(':projectId')
  @ApiOperation({ summary: 'Get a freelancer bid for a project' })
  @ApiResponse({ status: 200, description: 'Bid retrieved successfully' })
  getFreelancerBid(
    @ActiveUser('sub') freelancerId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.freelancersService.getFreelancerBid(freelancerId, projectId);
  }

  @Post(':projectId/suggestions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get suggestions on a freelancer bid' })
  @ApiResponse({ status: 200, description: 'Bid suggestions retrieved successfully' })
  getSuggestions(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createBidDto: CreateBidDto,
  ) {
    return this.freelancersService.getSuggestionsOnMyBid(projectId, createBidDto);
  }
}
