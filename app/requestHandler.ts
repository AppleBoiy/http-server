import {EchoHandler} from "./handlers/echo";
import {UserAgentHandler} from "./handlers/userAgent";
import {FilesHandler} from "./handlers/files";
import {constructResponse} from "./utils/responseUtils";

export class RequestHandler {
    private readonly echoHandler: EchoHandler;
    private readonly userAgentHandler: UserAgentHandler;
    private readonly filesHandler: FilesHandler;

    constructor(private readonly directory: string) {
        this.echoHandler = new EchoHandler();
        this.userAgentHandler = new UserAgentHandler();
        this.filesHandler = new FilesHandler(directory);
    }

    public handleRequest(method: string, requestPath: string, headers: {
        [key: string]: string
    }, body: string): string {
        try {
            switch (method) {
                case "GET":
                    return this.handleGetRequest(requestPath, headers);
                case "POST":
                    return this.handlePostRequest(requestPath, body);
                default:
                    return this.methodNotAllowedResponse();
            }
        } catch (error: any) {
            console.error(`Error handling ${method} ${requestPath}: ${error.message}`);
            return constructResponse("500", "Internal Server Error", "text/plain", "Internal Server Error");
        }
    }

    private handleGetRequest(requestPath: string, headers: { [key: string]: string }): string {
        if (requestPath === "/") {
            return constructResponse("200", "OK", "text/plain", "");
        } else if (requestPath === "/user-agent") {
            const userAgent = headers["User-Agent"] || "Unknown";
            return this.userAgentHandler.GET(userAgent);
        } else if (requestPath.startsWith("/echo/")) {
            const echoStr = requestPath.slice(6); // Extract the string from the path
            return this.echoHandler.GET(echoStr);
        } else if (requestPath.startsWith("/files/")) {
            const filename = requestPath.slice(7); // Extract the filename from the path
            return this.filesHandler.GET(filename);
        } else {
            return constructResponse("404", "Not Found", "text/plain", "404 Not Found");
        }
    }

    private handlePostRequest(requestPath: string, body: string): string {
        if (requestPath.startsWith("/files/")) {
            const filename = requestPath.slice(7); // Extract the filename from the path
            return this.filesHandler.POST(filename, body);
        } else {
            return constructResponse("404", "Not Found", "text/plain", "404 Not Found");
        }
    }

    private methodNotAllowedResponse(): string {
        return constructResponse("405", "Method Not Allowed", "text/plain", "405 Method Not Allowed");
    }
}