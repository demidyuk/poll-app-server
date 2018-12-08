import { IsValidId } from '../../util/isValidId';

export class GetGroupDto {
  @IsValidId()
  id: string;
}
