import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { DevGuard } from '../dev.guard';
import * as faker from 'faker';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('test')
  @UseGuards(DevGuard)
  async getTestUser(@Req() req, @Res() res) {
    const name = faker.name.findName();
    const { id } = await this.usersService.createOrUpdate({
      name,
      github_username: '__test__',
      email: faker.internet.email(...name.split(' ')),
      avatar: faker.internet.avatar(),
      test: true,
    });
    res.redirect('/auth/token/' + id);
  }
}
