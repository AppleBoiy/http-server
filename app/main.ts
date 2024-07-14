import * as net from "net";

// Helper function to construct HTTP response
function constructResponse(
    statusCode: string,
    statusMessage: string,
    contentType: string,
    body: string
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

const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const message = data.toString();
        const [requestLine, ...headerLines] = message.split("\r\n");
        const [method, path] = requestLine.split(" ");

        // Parse headers into an object
        const headers = headerLines.reduce((acc: { [key: string]: string }, line) => {
            const [key, value] = line.split(": ");
            if (key && value) {
                acc[key] = value;
            }
            return acc;
        }, {});

        let response: string;

        if (method !== "GET") {
            response = constructResponse("405", "Method Not Allowed", "text/plain", "405 Method Not Allowed");
        } else if (path === "/") {
            response = "HTTP/1.1 200 OK\r\n\r\n";
        } else if (path.startsWith("/echo/")) {
            const echoStr = path.slice(6); // Extract the string from the path
            response = constructResponse("200", "OK", "text/plain", echoStr);
        } else if (path === "/user-agent") {
            const userAgent = headers["User-Agent"] || "Unknown";
            response = constructResponse("200", "OK", "text/plain", userAgent);
        } else {
            response = constructResponse("404", "Not Found", "text/plain", "404 Not Found");
        }

        socket.write(response);
    });

    socket.on("error", (err: Error) => {
        console.error(err);
    });
});

server.listen(4221, "localhost", () => {
    console.log("Server is listening on localhost:4221");
});