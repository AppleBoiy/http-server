import * as fs from "fs";
import * as path from "path";
import {argv} from "process";
import {constructResponse} from "./responseUtils";

export class RequestHandler {
    private filesDirectory: string;

    constructor() {
        this.filesDirectory = "";
    }


    public handleRequest(method: string, requestPath: string, headers: { [key: string]: string }): string {
        if (method !== "GET") {
            return constructResponse("405", "Method Not Allowed", "text/plain", "405 Method Not Allowed");
        } else if (requestPath === "/") {
            return "HTTP/1.1 200 OK\r\n\r\n";
        } else if (requestPath.startsWith("/echo/")) {
            const echoStr = requestPath.slice(6); // Extract the string from the path
            return constructResponse("200", "OK", "text/plain", echoStr);
        } else if (requestPath === "/user-agent") {
            const userAgent = headers["User-Agent"] || "Unknown";
            return constructResponse("200", "OK", "text/plain", userAgent);
        } else if (requestPath.startsWith("/files/")) {
            const directoryArgIndex = argv.indexOf("--directory");
            if (directoryArgIndex === -1 || directoryArgIndex + 1 >= argv.length) {
                console.error("Error: --directory flag is required");
                process.exit(1);
            }
            this.filesDirectory = argv[directoryArgIndex + 1];

            const filename = requestPath.slice(7); // Extract the filename from the path
            const filePath = path.join(this.filesDirectory, filename);

            try {
                const data = fs.readFileSync(filePath);
                return constructResponse("200", "OK", "application/octet-stream", data);
            } catch (err) {
                return constructResponse("404", "Not Found", "text/plain", "404 Not Found");
            }
        } else {
            return constructResponse("404", "Not Found", "text/plain", "404 Not Found");
        }
    }
}