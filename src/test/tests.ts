/**
 * Test represents a single test case.
 */
export interface Test {
    /**
     * title of the test.
     */
    title: string

    /**
     * schema used by the parser to parse your test line.
     */
    schema: string

    /**
     * line represents a single line of a nginx log file.
     */
    line: string

    /**
     * want contains the keys and values expected as result from the parser.
     * This should only be set if #wantError is not set.
     */
    want?: { [key: string]: string }

    /**
     * wantError is set to true if the parser is expected to throw an error with the given input line.
     * This should only be set if #want is not set.
     */
    wantError?: boolean
}

export const tests: Test[] = [{
    title: "should accept a valid input schema and line",
    schema: '$remote_addr - $remote_user [$time_local]'
        + ' "$request" $status $bytes_sent "$http_referer" "$http_user_agent"',
    line: '127.0.0.1 - - [07/Jul/2018:17:37:28 +0200] "GET /7d32ce87648a4050faca.hot-update.json HTTP/1.1" 200 43'
        + ' "http://test.local/" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0"',
    want: {
        remote_addr: '127.0.0.1',
        remote_user: '-',
        time_local: '07/Jul/2018:17:37:28 +0200',
        request: 'GET /7d32ce87648a4050faca.hot-update.json HTTP/1.1',
        status: '200',
        bytes_sent: '43',
        http_referer: 'http://test.local/',
        http_user_agent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0',
    },
}, {
    title: "should not accept the input line if it contains too many values",
    schema: '$remote_addr - $remote_user [$time_local]',
    line: '127.0.0.1 - - [07/Jul/2018:17:37:28 +0200] -',
    wantError: true

}]
