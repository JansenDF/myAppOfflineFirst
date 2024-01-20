// model/Post.js
import { Model } from '@nozbe/watermelondb'
import { text } from '@nozbe/watermelondb/decorators'


export class User extends Model {
  static table = 'user'

  @text('name') name!: string
  @text('matricula') matricula!: string
  @text('email') email!: string
  @text('password') password!: string
  @text('profile_code') profile_code!: string

}