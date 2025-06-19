import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './entity/review.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VALIDATION_PIPE } from 'src/validation/pipe/validation.pipe';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/user/enum/role.enum';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { UserRequest } from 'src/auth/type/user-request.type';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewParam } from './param/review.param';
import { ReviewResponse } from './response/review.response';
import { GetReviewsQuery } from './query/get-reviews.query';

@ApiBearerAuth()
@Controller('review')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(VALIDATION_PIPE)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Roles(Role.purchaser)
  @ApiOperation({
    summary: 'Get reviews',
    description: `*roles*: **${[Role.purchaser].toString()}**`,
  })
  @ApiResponse({ type: ReviewResponse, isArray: true })
  @UseInterceptors(new TransformInterceptor(ReviewResponse))
  @Get()
  async getReviews(
    @Query() reviewsQuery: GetReviewsQuery,
    @Request() req: UserRequest,
  ): Promise<Array<Review>> {
    return await this.reviewService.getReviews(reviewsQuery, req.user);
  }

  @Roles(Role.purchaser)
  @ApiOperation({
    summary: 'Get review',
    description: `*roles*: **${[Role.purchaser].toString()}**`,
  })
  @ApiResponse({ type: ReviewResponse })
  @UseInterceptors(new TransformInterceptor(ReviewResponse))
  @Get(':review_type/:id')
  async getReview(@Param() reviewParam: ReviewParam, @Request() req: UserRequest): Promise<Review> {
    return await this.reviewService.getReview(reviewParam, req.user);
  }

  @Roles(Role.purchaser)
  @ApiOperation({
    summary: 'Update review',
    description: `*roles*: **${[Role.purchaser].toString()}**`,
  })
  @ApiResponse({ type: ReviewResponse })
  @UseInterceptors(new TransformInterceptor(ReviewResponse))
  @Put(':review_type/:id')
  async updateReview(
    @Param() reviewParam: ReviewParam,
    @Body() reviewDto: UpdateReviewDto,
    @Request() req: UserRequest,
  ): Promise<Review> {
    return await this.reviewService.updateReview(reviewParam, reviewDto, req.user);
  }

  @Roles(Role.purchaser)
  @ApiOperation({
    summary: 'Delete review',
    description: `*roles*: **${[Role.purchaser].toString()}**`,
  })
  @ApiResponse({ type: ReviewResponse })
  @UseInterceptors(new TransformInterceptor(ReviewResponse))
  @Delete(':review_type/:id')
  async deleteReview(@Param() reviewParam: ReviewParam, @Request() req: UserRequest): Promise<Review> {
    return await this.reviewService.deleteReview(reviewParam, req.user);
  }
}
