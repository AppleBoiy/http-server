import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const message = data.toString();
        const [method, path] = message.split(" ");

        let response = "HTTP/1.1 "
        if (method === "GET" && path === "/") {
            response += "200 OK";
        } else {
            response += "404 Not Found";
        }
        const responseBody = response + "\r\n\r\n";
        socket.write(responseBody);
    });

});

server.listen(4221, "localhost");
