import { Length, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class OptionDto {
  @Length(1, 100)
  value: string;
}

export class CreatePollDto {
  @Length(1, 100)
  question: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: OptionDto[];
}
