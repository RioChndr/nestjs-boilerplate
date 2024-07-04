import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';

@Controller('user')
export class UserController {

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me() {
    return { message: 'Hello from me' };
  }
}
