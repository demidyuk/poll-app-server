import { Length, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { OptionDto } from './option.dto';

export class PollDto {
  @Length(1, 100)
  question: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: OptionDto[];
}
