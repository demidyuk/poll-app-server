import { Length } from 'class-validator';

export class OptionDto {
  @Length(1, 100)
  value: string;
}
