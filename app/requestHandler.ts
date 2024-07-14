import * as net from 'net';
import {argv} from 'process';
import {readFileSync, writeFileSync} from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import {Response} from './response';

const directory = process.argv[3] || '.';

export class RequestHandler {
    constructor(private socket: net.Socket, private data: Buffer) {
    }

    handleRequest() {
        const requestLine = this.getRequestLine();
        if (!requestLine) {
            this.sendResponse(new Response(400, {}, 'Bad Request'));
            return;
        }

        const [method, requestPath] = requestLine;
        switch (true) {
            case requestPath === '/':
                this.handleRoot();
                break;
            case requestPath.startsWith('/echo/'):
                this.handleEcho(requestPath);
                break;
            case requestPath === '/user-agent':
                this.handleUserAgent();
                break;
            case requestPath.startsWith('/files/') && method === 'POST':
                this.handleFileUpload(requestPath);
                break;
            case requestPath.startsWith('/files/'):
                this.handleFileRequest(requestPath);
                break;
            default:
                this.sendResponse(new Response(404, {}, 'Not Found'));
        }
    }

    private getRequestLine(): [string, string] | null {
        const requestLines = this.data.toString().split('\r\n');
        const requestLine = requestLines[0].split(' ');
        if (requestLine.length < 2) return null;
        const [method, requestPath] = requestLine;
        return [method, requestPath];
    }

    private sendResponse(response: Response) {
        this.socket.write(response.toString());
        if (response.body instanceof Buffer) {
            this.socket.write(response.body);
        } else {
            this.socket.write(response.body);
        }
        this.socket.end();
    }

    private handleRoot() {
        this.sendResponse(new Response(200, {}, ''));
    }

    private handleEcho(requestPath: string) {
        const message = requestPath.split('/')[2];
        const reqBody = this.data.toString().split('\r\n');
        const encoding = reqBody.find((header) => header.includes('Accept-Encoding'));
        const acceptEncoding = encoding ? encoding.split(': ')[1] : '';
        const buffer = Buffer.from(message, 'utf8');
        const zipped = zlib.gzipSync(buffer);
        if (acceptEncoding.includes('gzip')) {
            this.sendResponse(new Response(200, {
                'Content-Type': 'text/plain',
                'Content-Encoding': 'gzip',
                'Content-Length': `${zipped.length}`,
            }, zipped));
        } else {
            this.sendResponse(new Response(200, {
                'Content-Type': 'text/plain',
                'Content-Length': `${message.length}`,
            }, message));
        }
    }

    private handleUserAgent() {
        const userAgentHeader = this.data.toString().split('\r\n').find((header) => header.includes('User-Agent'));
        if (!userAgentHeader) {
            this.sendResponse(new Response(400, {}, 'Bad Request'));
            return;
        }
        const userAgent = userAgentHeader.split(': ')[1];
        this.sendResponse(new Response(200, {
            'Content-Type': 'text/plain',
            'Content-Length': `${userAgent.length}`,
        }, userAgent));
    }

    private handleFileUpload(requestPath: string) {
        const fileName = requestPath.split('/')[2];
        const parts = this.data.toString().split('\r\n\r\n');
        const reqBody = parts.pop();
        writeFile(fileName, reqBody || "");
        this.sendResponse(new Response(201, {}, ''));
    }

    private handleFileRequest(requestPath: string) {
        const fileName = requestPath.split('/')[2];
        const dir = argv[argv.length - 1] || directory;
        try {
            const file = readFileSync(`${dir}/${fileName}`, 'utf8');
            this.sendResponse(new Response(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Length': `${file.length}`,
            }, file));
        } catch {
            this.sendResponse(new Response(404, {}, 'Not Found'));
        }
    }
}

function writeFile(filename: string, contents: string) {
    writeFileSync(path.join(directory, filename), contents);
}
