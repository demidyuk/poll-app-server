import { PollDto } from './poll.dto';
import { IsValidId } from '../../util/isValidId';

export class UpdatePollDto extends PollDto {
  @IsValidId()
  id: string;
}
