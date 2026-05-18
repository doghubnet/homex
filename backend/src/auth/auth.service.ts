import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid Home-X credentials.');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid Home-X credentials.');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('This Home-X user is not active.');
    }

    const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email, role: user.role });
    return {
      accessToken,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    };
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, role: true, status: true, jobTitle: true, employeeCode: true },
    });
  }
}
