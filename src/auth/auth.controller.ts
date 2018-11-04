import { Controller, Get, UseGuards, Req, Res, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { DevGuard } from '../dev.guard';
import { ConfigService } from '../config/config.service';

@Controller('auth')
export class AuthController {
  private clientUrl: string;
  constructor(
    private readonly authService: AuthService,
    config: ConfigService,
  ) {
    this.clientUrl = config.clientUrl;
  }

  @Get('token/:id')
  @UseGuards(DevGuard)
  async getToken(@Param('id') id) {
    return { token: await this.authService.createToken(id) };
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {}

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  async loginCallback(@Req() req, @Res() res) {
    res.redirect(
      this.clientUrl +
        '/signin/' +
        (await this.authService.createToken(req.user.id)),
    );
  }
}
