# nginx-log-parser

Parse Nginx logs with this simple parser.

ajaajajajajajaja test

[![Test Status](https://github.com/robojones/nginx-log-parser/workflows/Tests/badge.svg)](https://github.com/robojones/nginx-log-parser/actions?query=workflow%3ATests)

## Installation

```
npm i @robojones/nginx-log-parser
```

## API

### Parser

```typescript
const { Parser } = require('@robojones/nginx-log-parser')
const parser = new Parser(schema)
```

Creates a new parser for a specific log schema.
You can create multiple parsers for multiple schemas.

**Parameters**
- **schema** `<string>` The schema that is used in the nginx config for the logs.

### Parser#parseLine

```typescript
const data = parser.parseLine(line)
```

Parses a single line from your log file.
The line must match the schema or there may be unpredictable results.

**Parameters**
- **line** `<string>` A line from the nginx error or access log file.

## Example
```typescript
const { Parser } = require('@robojones/nginx-log-parser')

/** The schema from the nginx config. */
const schema = '$remote_addr - $remote_user [$time_local] "$request" $status $bytes_sent "$http_referer" "$http_user_agent"'

/** An example line from the /ver/log/nginx/acces.log file */
const line = '127.0.0.1 - - [07/Jul/2018:17:37:28 +0200] "GET /7d32ce87648a4050faca.hot-update.json HTTP/1.1" 200 43'
	+ ' "http://test.local/" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0"'

// Create a parser that can read our log schema.
const parser = new Parser(schema)

// Parse a line
const result = parser.parseLine(line)

/*
The result now contains an object like this:
{
	remote_addr: '127.0.0.1',
	remote_user: '-',
	time_local: '07/Jul/2018:17:37:28 +0200',
	request: 'GET /7d32ce87648a4050faca.hot-update.json HTTP/1.1',
	status: '200',
	bytes_sent: '43',
	http_referer: 'http://test.local/',
	http_user_agent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0',
}
*/
```
