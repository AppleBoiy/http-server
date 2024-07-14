import * as net from "net";

const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const message = data.toString();
        const [requestLine] = message.split("\r\n");
        const [method, path] = requestLine.split(" ");

        if (method !== "GET") {
            const response =
                `HTTP/1.1 404 Not Found\r\n` +
                `Content-Type: text/plain\r\n` +
                `Content-Length: 13\r\n` +
                `\r\n` +
                `404 Not Found`;

            socket.write(response);
        } else if (path === "/") {
            // Construct the response headers and body
            const contentType = "text/html";
            const content = "<h1>Hello, World!</h1>";
            const contentLength = Buffer.byteLength(content);

            const response =
                `HTTP/1.1 200 OK\r\n` +
                `Content-Type: ${contentType}\r\n` +
                `Content-Length: ${contentLength}\r\n` +
                `\r\n` +
                `${content}`;

            socket.write(response);

        } else if (path.startsWith("/echo")) {
            // Construct the response headers and body
            const echoStr = path.slice(6); // Extract the string from the path
            const contentType = "text/plain";
            const contentLength = Buffer.byteLength(echoStr);

            const response =
                `HTTP/1.1 200 OK\r\n` +
                `Content-Type: ${contentType}\r\n` +
                `Content-Length: ${contentLength}\r\n` +
                `\r\n` +
                `${echoStr}`;

            socket.write(response);
        }
    });

    socket.on("error", (err) => {
        console.error(err);
    });
});

server.listen(4221, "localhost", () => {
    console.log("Server is listening on localhost:4221");
});