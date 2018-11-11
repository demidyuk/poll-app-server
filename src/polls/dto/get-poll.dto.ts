import { IsValidId } from '../../util/isValidId';

export class GetPollDto {
  @IsValidId()
  id: string;
}
