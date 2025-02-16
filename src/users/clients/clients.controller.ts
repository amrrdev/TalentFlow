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

@Controller('projects')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Auth(AuthType.Bearer)
  getAllProjects(@ActiveUser('sub') clientId: number) {
    return this.clientsService.getAllProjects(clientId);
  }
  // TODO: Find a way to apply the Role decorator at the class level to avoid repeating it in each method.
  @Roles(Role.Client)
  @Post()
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @ActiveUser('sub', ParseIntPipe) clientId: number,
  ) {
    return this.clientsService.createProject(clientId, createProjectDto);
  }

  @Roles(Role.Client)
  @Patch(':id')
  updateProject(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @ActiveUser('sub', ParseIntPipe) clientId: number,
  ) {
    return this.clientsService.updateProject(clientId, projectId, updateProjectDto);
  }
  @Roles(Role.Client)
  @Delete(':id')
  deleteProject(@Param('id', ParseIntPipe) projectId: number, @ActiveUser('sub') clientId: number) {
    return this.clientsService.deleteProject(clientId, projectId);
  }

  @Auth(AuthType.Bearer)
  @Get('bids/:projectId')
  getAllBidsOnProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.clientsService.getAllBidsOnProject(projectId);
  }

  @Post('bids/:projectId')
  @Roles(Role.Client)
  selectBid(
    @ActiveUser('sub') clientId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() selectBidDto: SelectBidDto,
  ) {
    return this.clientsService.selectBid(clientId, projectId, selectBidDto);
  }
}
