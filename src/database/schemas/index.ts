import { appSchema } from '@nozbe/watermelondb'
import { userSchema } from './userSchema'

export const mySchema = appSchema({
  version: 1,
  tables: [
    // We'll add tableSchemas here later
    userSchema
  ]
})