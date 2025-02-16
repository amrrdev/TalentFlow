import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateBidDto } from './create-bid.dto';

export class UpdateBidDto extends PartialType(
  PickType(CreateBidDto, ['amount', 'coverLetter', 'cv', 'estimatedWork']),
) {}
