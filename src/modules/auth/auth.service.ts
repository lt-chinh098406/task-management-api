import { PostgresErrorCode } from '@/common/enums/postgres-error-code';
import { JwtPayload } from '@/common/interfaces/jwt-payload';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from '../user/dto/login.dto';
import { RefreshTokenDto } from '../user/dto/refresh-token.dto';
import { UserService } from '../user/user.service';
import { AuthModel } from './models/auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(body: CreateUserDto): Promise<AuthModel> {
    const hashPassword = await bcrypt.hash(body.password, 10);

    try {
      const user = await this.userService.createUser({
        ...body,
        password: hashPassword,
      });

      const { id, username } = user;
      const jwt = await this.convertToJwt(id, username);

      return jwt;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with this email or username already exists', HttpStatus.BAD_REQUEST);
      }

      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(body: LoginDto): Promise<AuthModel> {
    try {
      const user = await this.userService.findOneByUsername(body.username);

      if (!user) {
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }

      const isPasswordValid = await bcrypt.compare(body.password, user.password);

      if (!isPasswordValid) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }

      const { id, username } = user;
      const jwt = await this.convertToJwt(id, username);

      return jwt;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with this email or username already exists', HttpStatus.BAD_REQUEST);
      }

      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async refresh(body: RefreshTokenDto): Promise<AuthModel> {
    try {
      const payload = await this.jwtService.verifyAsync(body.refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.findOneByUsername(payload.username);

      if (!user) {
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }

      const { id, username } = user;
      const jwt = await this.convertToJwt(id, username);

      return jwt;
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST);
    }
  }

  async convertToJwt(userId: string, username: string): Promise<AuthModel> {
    const payload: JwtPayload = { username, sub: userId };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
