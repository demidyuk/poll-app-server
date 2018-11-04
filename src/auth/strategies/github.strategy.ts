import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: config.githubId,
      clientSecret: config.githubSecret,
      callbackURL: config.githubCallback,
      scope: ['user:email'],
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    const {
      displayName: name,
      username: github_username,
      emails: [{ value: email }],
      photos: [{ value: avatar }],
    } = profile;
    done(
      null,
      this.usersService.createOrUpdate({
        name,
        github_username,
        email,
        avatar,
      }),
    );
  }
}
