export function constructResponse(
    statusCode: string,
    statusMessage: string,
    contentType: string,
    body: string | Buffer
): string {
    const contentLength = Buffer.byteLength(body);
    return (
        `HTTP/1.1 ${statusCode} ${statusMessage}\r\n` +
        `Content-Type: ${contentType}\r\n` +
        `Content-Length: ${contentLength}\r\n` +
        `\r\n` +
        body
    );
}