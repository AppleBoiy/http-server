import * as fs from "fs";
import * as path from "path";
import {argv} from "process";
import {constructResponse} from "./responseUtils";

export class RequestHandler {
    private filesDirectory: string = "";

    constructor() {
        const directoryArgIndex = argv.indexOf("--directory");
        if (directoryArgIndex !== -1 && directoryArgIndex + 1 < argv.length) {
            this.filesDirectory = argv[directoryArgIndex + 1];
        }
    }

    public handleRequest(method: string, requestPath: string, headers: {
        [key: string]: string
    }, body: string): string {
        if (method !== "GET" && method !== "POST") {
            return constructResponse("405", "Method Not Allowed", "text/plain", "405 Method Not Allowed");
        } else if (method === "GET" && requestPath === "/") {
            return "HTTP/1.1 200 OK\r\n\r\n";
        } else if (method === "GET" && requestPath.startsWith("/echo/")) {
            const echoStr = requestPath.slice(6); // Extract the string from the path
            return constructResponse("200", "OK", "text/plain", echoStr);
        } else if (method === "GET" && requestPath === "/user-agent") {
            const userAgent = headers["User-Agent"] || "Unknown";
            return constructResponse("200", "OK", "text/plain", userAgent);
        } else if (method === "POST" && requestPath.startsWith("/files/")) {
            const filename = requestPath.slice(7); // Extract the filename from the path
            const filePath = path.join(this.filesDirectory, filename);

            try {
                fs.writeFileSync(filePath, body);
                return constructResponse("201", "Created", "text/plain", "File created successfully");
            } catch (err) {
                return constructResponse("500", "Internal Server Error", "text/plain", "Failed to create file");
            }
        } else if (method === "GET" && requestPath.startsWith("/files/")) {
            const filename = requestPath.slice(7); // Extract the filename from the path
            const filePath = path.join(this.filesDirectory, filename);

            try {
                const data = fs.readFileSync(filePath);
                return constructResponse("200", "OK", "application/octet-stream", data);
            } catch (err) {
                return constructResponse("404", "Not Found", "text/plain", "File not found");
            }
        } else {
            return constructResponse("404", "Not Found", "text/plain", "404 Not Found");
        }
    }
}