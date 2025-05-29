import {
  Body,
  Controller,
  Delete,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { VALIDATION_PIPE } from 'src/validation/pipe/validation.pipe';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/user/enum/role.enum';
import { IdMlDto } from './dto/id-ml.dto';
import { FavoriteResponse } from './response/favorite.response';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { Favorite } from './entity/favorite.entity';
import { UserRequest } from 'src/auth/type/user-request.type';

@Controller('favorite')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(VALIDATION_PIPE)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @ApiBearerAuth()
  @Roles(Role.purchaser)
  @ApiOperation({
    summary: 'Add favorite',
    description: `*roles*: **${[Role.purchaser].toString()}**`,
  })
  @ApiResponse({ type: FavoriteResponse })
  @ApiBody({ type: IdMlDto })
  @UseInterceptors(new TransformInterceptor(FavoriteResponse))
  @Post()
  async addFavorite(@Body() addFavoriteDto: IdMlDto, @Request() req: UserRequest): Promise<Favorite> {
    return await this.favoriteService.addFavorite(addFavoriteDto, req.user);
  }

  @ApiBearerAuth()
  @Roles(Role.purchaser)
  @ApiOperation({
    summary: 'Delete favorite',
    description: `*roles*: **${[Role.purchaser].toString()}**`,
  })
  @ApiResponse({ type: FavoriteResponse })
  @ApiBody({ type: IdMlDto })
  @UseInterceptors(new TransformInterceptor(FavoriteResponse))
  @Delete()
  async deleteFavorite(@Body() deleteFavoriteDto: IdMlDto, @Request() req: UserRequest): Promise<Favorite> {
    return await this.favoriteService.deleteFavorite(deleteFavoriteDto, req.user);
  }
}
