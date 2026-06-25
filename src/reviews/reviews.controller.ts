import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewMapper } from './mappers/review-mapper.dto';
import { ResponseReviewDto } from './dto/response-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update a movie review (upsert)' })
  @ApiResponse({ status: 201, description: 'Review processed successfully', type: ResponseReviewDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createReviewDto: CreateReviewDto, @Req() req: any): Promise<ResponseReviewDto> {
    const review = await this.reviewsService.create(createReviewDto, req.user.id);
    return ReviewMapper.toResponse(review);
  }

  @Get('me')
  @ApiOperation({ summary: 'List all reviews from the authenticated user' })
  @ApiResponse({ status: 200, description: 'User reviews returned successfully', type: [ResponseReviewDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findMyReviews(@Req() req: any): Promise<ResponseReviewDto[]> {
    const reviews = await this.reviewsService.findAllByUserId(req.user.id);
    return ReviewMapper.toResponseList(reviews);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an owned review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully', type: ResponseReviewDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Validation error or user is not the owner' })
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: any,
  ): Promise<ResponseReviewDto> {
    const updatedReview = await this.reviewsService.update(id, updateReviewDto, req.user.id);
    return ReviewMapper.toResponse(updatedReview);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an owned review' })
  @ApiResponse({ status: 204, description: 'Review removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'User is not the owner' })
  async remove(@Param('id') id: string, @Req() req: any): Promise<void> {
    await this.reviewsService.remove(id, req.user.id);
  }
}