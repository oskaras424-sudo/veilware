import { Pool, type PoolClient } from 'pg'

const globalForDb = globalThis as unknown as { veilwarePool?: Pool }

export const pool = globalForDb.veilwarePool ?? new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL ?? process.env.POSTGRES_URL })
if (process.env.NODE_ENV !== 'production') globalForDb.veilwarePool = pool

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
