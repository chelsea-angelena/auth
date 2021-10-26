import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { AuthModule } from './auth/auth.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
  const port = 5002


	app.enableCors({
		origin: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	})

	app.use(cookieParser())
	// app.use(express.json({ limit: '500mb' }))
	// app.use(express.urlencoded({ limit: '500mb', extended: true }))
	app.setGlobalPrefix('api')

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		})
	)

	const options = new DocumentBuilder()
		.setTitle('Auth example')
		.setDescription('Example Auth routes')
		.setVersion('1.0')
		.addTag('sample_app_api')
		.build()

	const Document = SwaggerModule.createDocument(app, options, {
		include: [AuthModule],
	})

	SwaggerModule.setup('api', app, Document)

	await app.listen(port)
	console.log(`listening on port ${await app.getUrl()}`)
}
bootstrap()
