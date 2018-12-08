import { IsValidId } from '../../util/isValidId';

export class AddPollDto {
  @IsValidId()
  groupId: string;

  @IsValidId()
  pollId: string;
}
