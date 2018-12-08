import { Length } from 'class-validator';

export class CreateGroupDto {
  @Length(1, 50)
  name: string;
}
