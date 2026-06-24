import { Review } from '../entities/review.entity';
import { ResponseReviewDto } from '../dto/response-review.dto';

export class ReviewMapper {
  static toResponse(entity: Review): ResponseReviewDto {
    return {
      id: entity.id,
      rating: Number(entity.rating), 
      comment: entity.comment,
      createdAt: entity.createdAt,
      user: {
        id: entity.user?.id,
        name: entity.user?.name,
      },
      movie: {
        id: entity.movie?.id,
        title: entity.movie?.title,
      },
    };
  }

  static toResponseList(entities: Review[]): ResponseReviewDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}