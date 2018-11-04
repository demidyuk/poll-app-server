import * as Joi from 'joi';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

export interface EnvConfig {
  [prop: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(
      Object.assign({ NODE_ENV: process.env.NODE_ENV }, config),
    );
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production'])
        .default('development'),
      CLIENT_URL: Joi.string().required(),
      MONGO_URI: Joi.string().required(),
      BUCKET_CAPACITY: Joi.number().required(),
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRATION: Joi.number().required(),
      GITHUB_ID: Joi.string().required(),
      GITHUB_SECRET: Joi.string().required(),
      GITHUB_CALLBACK: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
  get isDev(): boolean {
    return this.envConfig.NODE_ENV === 'development';
  }

  get clientUrl(): string {
    return this.envConfig.CLIENT_URL;
  }

  get mongoUri(): string {
    return this.envConfig.MONGO_URI;
  }

  get bucketCapacity(): number {
    return +this.envConfig.BUCKET_CAPACITY;
  }

  get jwtSecret(): string {
    return this.envConfig.JWT_SECRET;
  }

  get jwtExpiration(): number {
    return +this.envConfig.JWT_EXPIRATION;
  }

  get githubId(): string {
    return this.envConfig.GITHUB_ID;
  }

  get githubSecret(): string {
    return this.envConfig.GITHUB_SECRET;
  }

  get githubCallback(): string {
    return this.envConfig.GITHUB_CALLBACK;
  }
}
