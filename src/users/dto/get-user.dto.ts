import { IsValidId } from '../../util/isValidId';

export class GetUserDto {
  @IsValidId()
  id: string;
}
