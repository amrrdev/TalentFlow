import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ActiveUser } from '../../auth/decorators/active-user.decorator';
import { Roles } from '../../auth/authorization/decorators/role.decorator';
import { Role } from '../enum/role.enum';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Auth } from '../../auth/authentication/decorators/auth.decorator';
import { AuthType } from '../../auth/authentication/enums/auth-type.enum';
import { SelectBidDto } from './dto/select-bid.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Projects') // Group all endpoints under "Projects" in Swagger
@Controller('projects')
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Auth(AuthType.Bearer)
  @ApiOperation({ summary: 'Get all projects of the authenticated client' })
  getAllProjects(@ActiveUser('sub') clientId: number) {
    return this.clientsService.getAllProjects(clientId);
  }

  @Roles(Role.Client)
  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @ActiveUser('sub', ParseIntPipe) clientId: number,
  ) {
    return this.clientsService.createProject(clientId, createProjectDto);
  }

  @Roles(Role.Client)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'id', description: 'The ID of the project to update', example: 5 })
  updateProject(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @ActiveUser('sub', ParseIntPipe) clientId: number,
  ) {
    return this.clientsService.updateProject(clientId, projectId, updateProjectDto);
  }

  @Roles(Role.Client)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', description: 'The ID of the project to delete', example: 3 })
  deleteProject(@Param('id', ParseIntPipe) projectId: number, @ActiveUser('sub') clientId: number) {
    return this.clientsService.deleteProject(clientId, projectId);
  }

  @Auth(AuthType.Bearer)
  @Get('bids/:projectId')
  @ApiOperation({ summary: 'Get all bids on a specific project' })
  @ApiParam({ name: 'projectId', description: 'The ID of the project', example: 7 })
  getAllBidsOnProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.clientsService.getAllBidsOnProject(projectId);
  }

  @Roles(Role.Client)
  @Post('bids/:projectId')
  @ApiOperation({ summary: 'Select a bid for a project' })
  @ApiParam({ name: 'projectId', description: 'The ID of the project', example: 7 })
  selectBid(
    @ActiveUser('sub') clientId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() selectBidDto: SelectBidDto,
  ) {
    return this.clientsService.selectBid(clientId, projectId, selectBidDto);
  }

  @Get('bids/:projectId/suggestions')
  @ApiOperation({ summary: 'Get suggestions for selecting the best bid' })
  @ApiParam({ name: 'projectId', description: 'The ID of the project', example: 7 })
  suggetForSelectBestBid(
    @ActiveUser('sub') clientId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.clientsService.bidRecommendationsOnMyProject(projectId);
  }
}
