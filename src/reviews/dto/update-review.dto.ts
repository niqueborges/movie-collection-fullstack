import { IsNumber, Min, Max, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'The rating must be a number with at most 1 decimal place.' })
  @Min(0, { message: 'The minimum rating is 0.' })
  @Max(10, { message: 'The maximum rating is 10.' })
  rating?: number;

  @IsOptional()
  @IsString({ message: 'The comment must be text.' })
  comment?: string;
}