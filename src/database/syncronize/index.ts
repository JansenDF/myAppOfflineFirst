import { synchronize } from '@nozbe/watermelondb/sync'
import {database} from '../../database'


const mySync = async () => {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      console.log('Pull')
      console.log(lastPulledAt)
      console.log(schemaVersion)
      console.log(migration)
      console.log(database.collections)
      const urlParams = `last_pulled_at=${lastPulledAt}&schema_version=${schemaVersion}&migration=${encodeURIComponent(
        JSON.stringify(migration),
      )}`
      await fetch('http://192.168.1.14:5000/user/')
      console.log('Prrre-Response')
      const response = await fetch(`http://192.168.1.14:5000/sync?${urlParams}`)
      const res = response.json()
      const {changes, timestamp } = await res
      console.log({changes, timestamp})

      // console.log('resp ->',response)
      // console.log('resp_headers ->',response.headers)
      // console.log('resp_json -> ',response.json())
      // const data = response.json()
      // console.log("data ->", data)
      // if (!response.ok) {
      //   throw new Error(await response.text())
      // }
      // const { changes, timestamp } = await response.json()
      return { changes, timestamp }
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      console.log('entrei no post!')
      const response = await fetch(`http://192.168.1.14:5000/sync?last_pulled_at=${lastPulledAt}`, {
        method: 'POST',
        body: JSON.stringify(changes),
      })
      if (!response.ok) {
        throw new Error(await response.text())
      }
    },
    migrationsEnabledAtVersion: 1,
  })
  console.warn('FinalMySync')
}

export default mySync