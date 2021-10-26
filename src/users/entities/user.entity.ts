import { Column, Entity } from 'typeorm'
import { Exclude } from 'class-transformer'
import { Base } from '../../database/entities/base.enity'

@Entity()
export class User extends Base {
	@Column({ unique: true })
	public email: string


	@Column()
	@Exclude()
	public password: string

	@Column({ nullable: true })
	@Exclude()
	public currentHashedRefreshToken?: string

}
