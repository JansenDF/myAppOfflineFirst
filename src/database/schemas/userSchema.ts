// model/schema.js
import { tableSchema } from '@nozbe/watermelondb'

export const userSchema = tableSchema({
  name: 'user',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'matricula', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'password', type: 'string' },
    { name: 'profile_code', type: 'string' },
  ]
})