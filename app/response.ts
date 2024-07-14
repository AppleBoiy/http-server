export class Response {
    statusCode: number;
    headers: { [key: string]: string };
    body: string | Buffer;

    constructor(statusCode: number, headers: { [key: string]: string }, body: string | Buffer) {
        this.statusCode = statusCode;
        this.headers = headers;
        this.body = body;
    }

    toString(): string {
        let response = `HTTP/1.1 ${this.statusCode} ${this.getStatusText()}\r\n`;
        for (const header in this.headers) {
            response += `${header}: ${this.headers[header]}\r\n`;
        }
        response += '\r\n';
        return response;
    }

    private getStatusText(): string {
        const statusTexts: { [key: number]: string } = {
            200: 'OK',
            201: 'Created',
            400: 'Bad Request',
            404: 'Not Found',
        };
        return statusTexts[this.statusCode] || 'Unknown Status';
    }
}
