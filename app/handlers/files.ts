import * as fs from "fs";
import * as path from "path";
import {constructResponse} from "../utils/responseUtils";

export class FilesHandler {
    private readonly filesDirectory: string;

    constructor(directory: string) {
        this.filesDirectory = directory;
    }

    GET(filename: string): string {
        const filePath = path.join(this.filesDirectory, filename);

        try {
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath);
                return constructResponse("200", "OK", "application/octet-stream", data);
            } else {
                return constructResponse("404", "Not Found", "text/plain", "File not found");
            }
        } catch (err: any) {
            console.error(`Error reading file ${filePath}: ${err.message}`);
            return constructResponse("500", "Internal Server Error", "text/plain", "Failed to read file");
        }
    }

    POST(filename: string, body: string): string {
        const filePath = path.join(this.filesDirectory, filename);

        try {
            fs.writeFileSync(filePath, body);
            return constructResponse("201", "Created", "text/plain", "File created successfully");
        } catch (err: any) {
            console.error(`Error writing file ${filePath}: ${err.message}`);
            return constructResponse("500", "Internal Server Error", "text/plain", "Failed to create file");
        }
    }
}