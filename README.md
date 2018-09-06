# token-server

TLS encrypted communication

[![CircleCI](https://circleci.com/gh/robojones/token-server.svg?style=svg)](https://circleci.com/gh/robojones/token-server)

[![Test Coverage](https://api.codeclimate.com/v1/badges/f74e4d181314dd0d1e31/test_coverage)](https://codeclimate.com/github/robojones/token-server/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/f74e4d181314dd0d1e31/maintainability)](https://codeclimate.com/github/robojones/token-server/maintainability)

This module simplifies SSL encrypted communication.
It allows you to send messages (called tokens) from a client to a server and back.

## Example

This example shows how a client and a server can be connected using self-signed certificates.

For some help on how to generate self-signed certificates [see this comment](https://github.com/nodejs/help/issues/253#issuecomment-242425636).

```javascript
const { TokenServer, TokenClient } = require('token-server')

/* ### Server ### */

const server = new TokenServer({
	host: 'localhost',
	port: 8090,

	key: fs.readFileSync('certs/server/server.key'),
	cert: fs.readFileSync('certs/server/server.crt'),
	ca: fs.readFileSync('certs/ca/ca.crt'),
	requestCert: true, // ask for a client cert
})

// Listen for tokens from the client.
server.on('token', (token, connection) => {
	console.log('The client says:', token.toString())

	const token = Buffer.from('I am happy to see you!')
	connection.send(token)
})

/* ### Client ### */

const client = new TokenClient({
	host: 'localhost',
	port: 8090,

	key: fs.readFileSync('certs/client/client.key'),
	cert: fs.readFileSync('certs/client/client.crt'),
	ca: fs.readFileSync('certs/ca/ca.crt'),
})

client.on('token', (token, connection) => {
	console.log('The server responds', token.toString())
})

const token = Buffer.from('Hello!')
client.send(token)
```

## API

### Table of Contents

- [TokenClient](#tokenclient)
	- [constructor](#tokenclient-constructor)
	- [Event: "close"](#tokenclient-close)
	- [Event: "connect"](#tokenclient-connect)
	- [Event: "error"](#tokenclient-error)
	- [Event: "token"](#tokenclient-token)
	- [close()](#tokenclientclose)
	- [connect()](#tokenclientconnect)
	- [send()](#tokenclientsend)
- [TokenServer](#tokenserver)
	- [constructor](#tokenserver-constructor)
	- [Event: "close"](#tokenserver-close)
	- [Event: "connect"](#tokenserver-connect)
	- [Event: "error"](#tokenserver-error)
	- [Event: "token"](#tokenserver-token)
	- [close()](#tokenserverclose)
	- [connect()](#tokenserverconnect)
- [Connection](#connection)
	- [constructor](#connection-constructor)
	- [Event: "token"](#connection-token)
	- [isDead](#connectionisdead)
	- [close()](#connectionclose)
	- [send()](#connectionsend)

### TokenClient

This class represents a client that can connect to a server.

#### TokenClient constructor

```typescript
const client = new Client(options)
```

- **options**
	- port `<number>` The port that the client should connect to.
	- host `<string>` The hostname of the server.
	- key `<string|Buffer>` The private key of the client.
	- cert `<string|Buffer>` The SSL certificate of the client.
	- ca `<string|Buffer>` The authority certificate (used for self signed certificates)
	- All other options accepted by [tls.connect()](https://nodejs.org/api/tls.html#tls_tls_connect_options_callback)

#### TokenClient: "close"

This event is emitted when the client connection gets closed.

```typescript
client.on('close', (hadError) => {
	// ...your code...
})
```

- hadError `<boolean>` Is `true` if the client connection was closed by an error (e.g. if the server did not respond).

#### TokenClient: "connect"

This event is emitted when the client is successfully connected to the server.

```typescript
client.on('connect', () => {
	// ...your code...
})
```

#### TokenClient: "error"

This event is emitted when a connection error occured. It is always followed by a ["close" event](#tokenclient-close).

```typescript
client.on('error', (error) => {
	// ...your code...
})
```

- error `<Error>` The error that was emitted by the underlying TLS socket.

#### TokenClient: "token"

This event is emitted when the server sends a token in reponse to a token that was sent by this client.

```typescript
client.on('token', (token, connection) => {
	// ...your code...
})
```

- token `<Buffer>` The token that was received.
- connection `<Connection>` [see here](#connection) The connection that sent the token.

#### TokenClient#close()

This method is used to disconnect the client from the server.

```typescript
client.close()
```

This method returns `true` if the connection was ended.
If the client was already disconnected, the method returns `false`.

#### TokenClient#connect()

This method is used to reconnect the client to the server if the connection was closed.

```typescript
client.connect(delay)
```

- delay `<number>` _(optional)_ Time in milliseconds to wait before a new connection to the server is created.

Returns `true` if a new connection will be created. If the client is already connected, then `false` will be returned.

#### TokenClient#send()

This method allows you to send a token to the server.
Please note that the server has no `send()` method.
It can only respond if it receives a token of the client.

```typescript
client.send(token)
```

- token `<Buffer>` The token that should be sent to the server.

### TokenServer

This class represents a server that accepts SSL encrypted connections.

#### TokenServer constructor

```typescript
const server = new TokenServer(options)
```

- **options**
	- port `<number>` The port that the server should listen to.
	- host `<string>` The hostname to listen to.
	- key `<string|Buffer>` The private key of the server.
	- cert `<string|Buffer>` The SSL certificate of the server.
	- ca `<string|Buffer>` The authority certificate (used for self signed certificates)
	- All other options accepted by [tls.createServer()](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener) and [server.listen](https://nodejs.org/api/net.html#net_server_listen_options_callback).

#### TokenServer: "close"

This event is emitted when the server gets closed.

```typescript
server.on('close', (hadError) => {
	// ...your code...
})
```

- hadError `<boolean>` Is `true` if the server was closed by an error (e.g. if the port was already in use).

#### TokenServer: "connect"

This event is emitted when the server is successfully listening to the specified port.

```typescript
server.on('connect', () => {
	// ...your code...
})
```

#### TokenServer: "error"

This event is emitted when a server error occured. It is always followed by a ["close" event](#tokenserver-close).

```typescript
server.on('error', (error) => {
	// ...your code...
})
```

- error `<Error>` The error that was emitted by the underlying TLS server.

#### TokenServer: "token"

This event is emitted when the server receives a token from a client.
The server send a token back to the client by calling `connection.send(token)`.

```typescript
server.on('token', (token, connection) => {
	// ...your code...
})
```

- token `<Buffer>` The token that was received.
- connection `<Connection>` [see here](#connection) The connection that sent the token.

#### TokenServer#close()

This method is used to disconnect the server.
The server will wait for all connections to close before it stops listening to its port.

```typescript
server.close()
```

This method returns `true` if the server was closed.
If the server was already closed, the method returns `false`.

#### TokenServer#connect()

This method is used to reconnect the server to its port.
You can use this method if the port was used before und you want to retry to listen to the port.

```typescript
const result = client.connect(delay)
```

- delay `<number>` _(optional)_ Time in milliseconds to wait before the server tries to listen to the port.

Returns `true` if a new connection will be created. If the server is already connected, then `false` will be returned.

### Connection

This class is a wrapper for a stream or socket.
It parses all the data that goes through the stream and emits a `"token"` event when a token gets sent.
The class can be used on both sides of a duplex stream to send and receive tokens.

#### Connection constructor

```typescript
const connection = new Connection(socket)
```

- socket `<net.Socket>` [see here](https://nodejs.org/api/net.html#net_class_net_socket) A connection that can be created e.g. with [net.connect](https://nodejs.org/api/net.html#net_net_connect).

#### Connection: "token"

This event is emitted when a token arrives at the underlying socket.

```typescript
connection.on('token', (token) => {
	// ...your code...
})
```

- token `<Buffer>` The token that was received.

#### Connection#isDead

Is a boolean that is `true` if the underlying socket is writable and `false` if it is not.

```typescript
const status = connection.isDead
```

#### Connection#close()

This method is used to disconnect from the server.

```typescript
const result = connection.close()
```

This method returns `true` if the connection was ended.
If the client was already disconnected, the method returns `false`.

#### Connection#send()

This method allows you to send a token through the connection.

```typescript
const success = client.send(token)
```

The method returns `true` if the message was written to the underlying socket. It returns `false` if the connection is dead.
