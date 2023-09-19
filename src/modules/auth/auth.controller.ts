import { GetUser } from '@/common/decorators';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from '../user/dto/login.dto';
import { RefreshTokenDto } from '../user/dto/refresh-token.dto';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthModel } from './models/auth.model';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ description: 'OK', type: AuthModel })
  register(@Body() body: CreateUserDto): Promise<AuthModel> {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiCreatedResponse({ description: 'OK', type: AuthModel })
  login(@Body() body: LoginDto): Promise<AuthModel> {
    return this.authService.login(body);
  }

  @Post('refresh-token')
  @ApiCreatedResponse({ description: 'OK', type: AuthModel })
  refresh(@Body() body: RefreshTokenDto): Promise<AuthModel> {
    return this.authService.refresh(body);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @Get('me')
  @UseGuards(AuthGuard())
  me(@GetUser() user: User): User {
    return user;
  }
}
