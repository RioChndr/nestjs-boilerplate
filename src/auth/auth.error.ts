import { HttpException } from "@nestjs/common";

export class UserNotFoundAuthError extends HttpException {
  constructor() {
    super({
      status: 401,
      error: 'User not found'
    }, 401);
  }
}

export class InvalidPasswordAuthError extends HttpException {
  constructor() {
    super({
      status: 401,
      error: 'Invalid password'
    }, 401);
  }
}

export class InvalidTokenAuthError extends HttpException {
  constructor() {
    super({
      status: 401,
      error: 'Invalid token'
    }, 401);
  }
}