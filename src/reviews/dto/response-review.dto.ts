export class ResponseReviewDto {
  id!: string;
  rating!: number;
  comment?: string;
  createdAt!: Date;
  user!: {
    id: string;
    name: string;
  };
  movie!: {
    id: string;
    title: string;
  };
}