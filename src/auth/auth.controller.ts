import {
	Body,
	Req,
	Controller,
	HttpCode,
	Post,
	UseGuards,
	Get,
	ClassSerializerInterceptor,
	UseInterceptors,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { RequestWithUser } from './guards/requestWithUser.interface'
import { LocalAuthGuard } from './guards/localAuth.guard'
import JwtAuthGuard from './guards/jwt-auth.guard'
import { UsersService } from '../users/users.service'
import JwtRefreshGuard from './guards/jwt-refresh.guard'

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService
	) {}

	@HttpCode(200)
	@Post('register')
	async register(@Body() registrationData: RegisterDto) {
		console.log(registrationData, 'reg')
		const user = await this.authService.register(registrationData)
		return user
	}

	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async logIn(@Req() request: RequestWithUser) {
		const { user } = request
		console.log(user, 'l;ogin')
		const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
			user.id
		)
		const { cookie: refreshTokenCookie, token: refreshToken } =
			this.authService.getCookieWithJwtRefreshToken(user.id)

		await this.usersService.setCurrentRefreshToken(refreshToken, user.id)

		request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie])

		return user
	}

	@UseGuards(JwtAuthGuard)
	@Post('logout')
	@HttpCode(200)
	async logOut(@Req() request: RequestWithUser) {
		await this.usersService.removeRefreshToken(request.user.id)
		request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut())
	}

	@UseGuards(JwtAuthGuard)
	@Get('user')
	@HttpCode(200)
	authenticate(@Req() request: RequestWithUser) {
		console.log(request.user)
		return request.user
	}

	@UseGuards(JwtRefreshGuard)
	@Get('refresh')
	@HttpCode(200)
	refresh(@Req() request: RequestWithUser) {
		const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
			request.user.id
		)

		request.res.setHeader('Set-Cookie', accessTokenCookie)
		return request.user
	}
}
