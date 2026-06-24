import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersMapper } from './users.mapper';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Profile returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req: any) {
    this.logger.log(`Handling getProfile request for user ID: ${req.user.id}`);
    const user = await this.usersService.findById(req.user.id);
    return UsersMapper.toDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    this.logger.log(
      `Handling updateProfile request for user ID: ${req.user.id}`,
    );
    const user = await this.usersService.update(req.user.id, dto);
    return UsersMapper.toDto(user);
  }
}
