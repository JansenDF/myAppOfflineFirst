import { synchronize } from '@nozbe/watermelondb/sync'
import {database} from '../../database'


const mySync = async () => {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      console.log("PullChanges...")
      const urlParams = `last_pulled_at=${lastPulledAt}&schema_version=${schemaVersion}&migration=${encodeURIComponent(
        JSON.stringify(migration),
      )}`
      const response = await fetch(`http://192.168.1.14:5000/sync?${urlParams}`)
      if (!response.ok) {
        throw new Error(await response.text())
      }
      const res = response.json()
      const {changes, timestamp } = await res
      console.log("Changes e Timestamp do Backend", {changes, timestamp})
      return { changes, timestamp }
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      console.log("PushChanges...")
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
  console.warn('Sincronização realizada com sucesso!')
}

export default mySync