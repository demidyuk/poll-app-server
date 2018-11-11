import { IsValidId } from '../../util/isValidId';

export class VoteDto {
  @IsValidId()
  pollId: string;

  @IsValidId()
  optionId: string;
}
