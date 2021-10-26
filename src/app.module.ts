import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { ConfigModule } from '@nestjs/config'
import * as Joi from '@hapi/joi'


@Module({
	imports: [
		ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        /* general */

        STAGE: Joi.string().required(),
        CLIENT_ORIGIN: Joi.string().required(),
        /* database */ 
        DB_HOST: Joi.string().required(),
    
        DB_DATABASE: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_TYPE: Joi.string().required(),
        /*JWT auth */
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(), 
        JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
        JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(), }),
      }),
		DatabaseModule,
		UsersModule,
		AuthModule
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
