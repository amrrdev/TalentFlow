import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(
  PickType(CreateProjectDto, ['budget', 'category', 'deadline', 'description', 'skills', 'title']),
) {}
