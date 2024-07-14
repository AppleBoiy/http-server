import {Socket} from "net";
import {RequestHandler} from "./requestHandler";

export class HTTPHandler {
    private requestHandler: RequestHandler;

    constructor() {
        this.requestHandler = new RequestHandler();
    }

    public handleRequest(socket: Socket, data: Buffer): void {
        const message = data.toString();
        const [requestLine, ...headerLines] = message.split("\r\n");
        const [method, requestPath] = requestLine.split(" ");

        const headers = this.parseHeaders(headerLines);

        const response = this.requestHandler.handleRequest(method, requestPath, headers);
        socket.write(response);
    }

    private parseHeaders(headerLines: string[]): { [key: string]: string } {
        return headerLines.reduce((acc: { [key: string]: string }, line) => {
            const [key, value] = line.split(": ");
            if (key && value) {
                acc[key] = value;
            }
            return acc;
        }, {});
    }
}