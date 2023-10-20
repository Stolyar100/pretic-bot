import { EnvType, load } from 'ts-dotenv'
import schema from './schema.js'

export type Env = EnvType<typeof schema>

export let env: Env

export function loadEnv() {
  env = load(schema)
}
