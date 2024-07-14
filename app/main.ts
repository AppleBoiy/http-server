import * as net from "net";
import {HTTPHandler} from "./httpHandler";

const server = net.createServer((socket) => {
    const httpHandler = new HTTPHandler();

    socket.on("data", (data) => {
        httpHandler.handleRequest(socket, data);
    });

    socket.on("error", (err) => {
        console.error(err);
    });
});

server.listen(4221, "localhost", () => {
    console.log("Server is listening on localhost:4221");
});