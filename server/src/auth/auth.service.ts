import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import { IUser } from '../types/user.type';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    const matchPassword = await argon2.verify(user.password, password);

    if (user && matchPassword) {
      return user;
    }
    throw new UnauthorizedException('User or password are incorrect!');
  }

  async login(user: IUser) {
    const { id, email } = user;
    const token = this.jwtService.sign({ id: user.id, email: user.email});
    return {
      id,
      email,
      token,
    };
  }


  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }
  //
  // findAll() {
  //   return `This action returns all auth`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }
  //
  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
