import { IsValidId } from '../../util/isValidId';

export class RemovePollDto {
  @IsValidId()
  groupId: string;

  @IsValidId()
  pollId: string;
}
