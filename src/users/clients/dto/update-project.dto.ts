import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(
  PickType(CreateProjectDto, ['budget', 'category', 'deadline', 'description', 'skills', 'title']),
) {
  @ApiProperty({
    description: 'Updated project title',
    example: 'New Website Development',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Updated project description',
    example: 'Develop a responsive web app',
    required: false,
  })
  description?: string;

  @ApiProperty({ description: 'Updated project budget', example: 1500, required: false })
  budget?: number;

  @ApiProperty({
    description: 'Updated project category',
    example: 'Web Development',
    required: false,
  })
  category?: string;

  @ApiProperty({
    description: 'Updated required skills',
    example: ['React', 'Node.js'],
    required: false,
    type: [String],
  })
  skills?: string[];

  @ApiProperty({
    description: 'Updated project deadline',
    example: '2024-12-31',
    required: false,
    type: String,
    format: 'date',
  })
  deadline?: Date;
}
