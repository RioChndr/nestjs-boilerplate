import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';

@Controller('user')
export class UserController {

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req) {
    return req.user
  }
}
