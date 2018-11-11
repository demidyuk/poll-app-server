import { IsValidId } from '../../util/isValidId';

export class GetUserDto {
  @IsValidId(true)
  id: string;
}
