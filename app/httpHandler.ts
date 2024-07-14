import {Socket} from "net";
import {RequestHandler} from "./requestHandler";

export class HTTPHandler {
    private requestHandler: RequestHandler;

    constructor() {
        this.requestHandler = new RequestHandler();
    }

    public handleRequest(socket: Socket, data: Buffer): void {
        const message = data.toString();
        const [requestLine, ...headerLinesAndBody] = message.split("\r\n");
        const [method, requestPath] = requestLine.split(" ");

        const headers = this.parseHeaders(headerLinesAndBody.slice(0, -2)); // Exclude the last empty line

        let body = "";
        if (headerLinesAndBody.length > 2) {
            body = headerLinesAndBody.slice(-1)[0];
        }

        const response = this.requestHandler.handleRequest(method, requestPath, headers, body);
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