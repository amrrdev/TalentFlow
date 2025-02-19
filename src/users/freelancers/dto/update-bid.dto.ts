import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateBidDto } from './create-bid.dto';

export class UpdateBidDto extends PartialType(
  PickType(CreateBidDto, ['amount', 'coverLetter', 'cv', 'estimatedWork']),
) {
  @ApiPropertyOptional({ description: 'Updated bid amount', example: 600 })
  amount?: number;

  @ApiPropertyOptional({
    description: 'Updated cover letter',
    example: 'I have additional experience in backend development...',
  })
  coverLetter?: string;

  @ApiPropertyOptional({ description: 'Updated CV URL', example: 'https://example.com/new-cv.pdf' })
  cv?: string;

  @ApiPropertyOptional({ description: 'Updated estimated work duration', example: '3 weeks' })
  estimatedWork?: string;
}
