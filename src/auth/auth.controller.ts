import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('refresh-token')
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req);
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth() {
    return 'Google Auth';
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleAuthCallback(@Request() req) {
    return this.authService.login(req.user);
  }
}
