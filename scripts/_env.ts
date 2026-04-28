// Side-effect module: load .env.local before any other module touches
// process.env. Import this FIRST in scripts that talk to the DB or other
// envvars defined locally.
import { config as loadEnv } from 'dotenv'

loadEnv({ path: ['.env.local', '.env'], quiet: true })
