import { IsNotEmpty, IsUUID, IsNumber, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'The movie ID is required.' })
  @IsUUID('4', { message: 'The movie ID must be a valid UUID.' })
  movieId!: string;

  @IsNotEmpty({ message: 'The rating is required.' })
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'The rating must be a number with at most 1 decimal place.' })
  @Min(0, { message: 'The minimum rating is 0.' })
  @Max(10, { message: 'The maximum rating is 10.' })
  rating!: number;

  @IsOptional()
  @IsString({ message: 'The comment must be text.' })
  comment?: string;
}