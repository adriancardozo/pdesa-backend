import {
  Controller,
  Delete,
  Get,
  Param,
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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
    summary: 'Get favorites',
    description: `*roles*: **${[Role.purchaser].toString()}**`,
  })
  @ApiResponse({ type: FavoriteResponse, isArray: true })
  @UseInterceptors(new TransformInterceptor(FavoriteResponse))
  @Get()
  async getFavorites(@Request() req: UserRequest): Promise<Array<Favorite>> {
    return await this.favoriteService.getFavorites(req.user);
  }

  @ApiBearerAuth()
  @Roles(Role.purchaser)
  @ApiOperation({
    summary: 'Get favorite',
    description: `*roles*: **${[Role.purchaser].toString()}**`,
  })
  @ApiResponse({ type: FavoriteResponse })
  @UseInterceptors(new TransformInterceptor(FavoriteResponse))
  @Get(':idMl')
  async getFavorite(@Param() getFavoriteDto: IdMlDto, @Request() req: UserRequest): Promise<Favorite> {
    return await this.favoriteService.getFavorite(getFavoriteDto, req.user);
  }

  @ApiBearerAuth()
  @Roles(Role.purchaser)
  @ApiOperation({
    summary: 'Add favorite',
    description: `*roles*: **${[Role.purchaser].toString()}**`,
  })
  @ApiResponse({ type: FavoriteResponse })
  @UseInterceptors(new TransformInterceptor(FavoriteResponse))
  @Post(':idMl')
  async addFavorite(@Param() addFavoriteDto: IdMlDto, @Request() req: UserRequest): Promise<Favorite> {
    return await this.favoriteService.addFavorite(addFavoriteDto, req.user);
  }

  @ApiBearerAuth()
  @Roles(Role.purchaser)
  @ApiOperation({
    summary: 'Delete favorite',
    description: `*roles*: **${[Role.purchaser].toString()}**`,
  })
  @ApiResponse({ type: FavoriteResponse })
  @UseInterceptors(new TransformInterceptor(FavoriteResponse))
  @Delete(':idMl')
  async deleteFavorite(
    @Param() deleteFavoriteDto: IdMlDto,
    @Request() req: UserRequest,
  ): Promise<Favorite> {
    return await this.favoriteService.deleteFavorite(deleteFavoriteDto, req.user);
  }
}
