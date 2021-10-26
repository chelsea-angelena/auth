import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './guards/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './guards/jwt-strategy';
import { JwtRefreshTokenStrategy } from './guards/jwt-refresh-token.strategy';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				cors: {
					origin: configService.get('CLIENT_ORIGIN'),
					credentials: true,
				},
				secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
				signOptions: {
					expiresIn: '24h',
				},
			}),
		}),
		forwardRef(() => UsersModule),
		PassportModule,
	],
	providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
