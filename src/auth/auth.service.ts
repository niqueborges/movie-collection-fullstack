import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersMapper } from '../users/users.mapper';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    this.logger.log(`Registering new user with email: ${dto.email}`);
    const user = await this.usersService.create(dto);

    const token = this.generateToken(user.id, user.email);
    this.logger.log(`User registered successfully: ${user.id}`);

    return {
      user: UsersMapper.toDto(user),
      access_token: token,
    };
  }

  async login(dto: LoginDto) {
    this.logger.log(`Login attempt for email: ${dto.email}`);
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      this.logger.warn(`Login failed - User not found: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      this.logger.warn(`Login failed - Incorrect password for: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email);
    this.logger.log(`User logged in successfully: ${user.id}`);

    return {
      user: UsersMapper.toDto(user),
      access_token: token,
    };
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
