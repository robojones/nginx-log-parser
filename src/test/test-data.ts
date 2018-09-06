import { readFileSync } from 'fs'

const file = readFileSync('test-data/access.log').toString()
export const lines = file.split('\n')
export const schema = '$remote_addr - $remote_user [$time_local]'
	+ ' "$request" $status $bytes_sent "$http_referer" "$http_user_agent"'
