import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../provider/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly db: PrismaService
  ) { }

  findUserByEmail(email: string) {
    return this.db.user.findUnique({
      where: {
        email
      }
    })
  }
}
