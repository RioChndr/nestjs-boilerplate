import { BadRequestException, Inject, Injectable, Logger, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { v4 as uuidv4 } from 'uuid';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  logger = new Logger('AuthService');

  // handle the logic from passport local strategy
  async validateUser(email: string, passwordRaw: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return null
    }
    if (bcrypt.compareSync(passwordRaw, user.password)) {
      return {
        ...user,
        password: undefined
      };
    } else {
      return null
    }
  }

  async login(user: Omit<User, 'password'>) {
    const sessionId = uuidv4();
    const refreshId = uuidv4();

    const payload = {
      sub: user.id,
      email: user.email,
    }

    const accessToken = this.jwtService.sign({
      ...payload,
      typ: 'access',
    }, {
      jwtid: sessionId,
    })

    // this cache can be used to validate the session if you want
    // but for now, we just use it to store the user id
    const keyCache = `authz:session:${sessionId}`;
    await this.cacheManager.set(keyCache, user.id, 60 * 60)

    const refreshToken = this.jwtService.sign({
      ...payload,
      typ: 'refresh',
    }, {
      expiresIn: '7d',
      jwtid: refreshId,
    })
    await this.cacheManager.set(`authz:refresh:${refreshId}`, user.id, 7 * 24 * 60 * 60)

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }


  async refreshToken(req: { headers: { authorization: string } }) {
    const refreshToken = req.headers.authorization.split(' ')[1];

    const payload = this.jwtService.verify(refreshToken) as { sub: number, jti: string, email: string, typ: string };

    const keyCache = `authz:refresh:${payload.jti}`;

    if (
      payload.typ !== 'refresh' ||
      await this.cacheManager.get(keyCache) !== payload.sub) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
    await this.cacheManager.del(keyCache);

    return this.login({ id: payload.sub, email: payload.email } as User);
  }

  /**
   * you can add more logic here to validate the session
   * @param payloadJwt 
   * @returns 
   */
  async validateSession(payloadJwt: { sub: number, jti: string, email: string, typ: string }) {
    if (
      payloadJwt.typ !== 'access'
    ) {
      throw new UnauthorizedException('Access token is invalid or expired');
    }

    return {
      id: payloadJwt.sub,
      email: payloadJwt.email,
    }
  }


  async callbackOAuthGoogle(props: { accessToken: string, refreshToken: string, profile: any }) {
    const user = await this.userService.findUserByEmail(props.profile.emails[0].value);
    if (!user) {
      throw new BadRequestException('User not found')
    }
    return user;
  }
}
