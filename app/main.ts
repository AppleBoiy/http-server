import * as net from "net";
import {HTTPHandler} from "./httpHandler";

const server = net.createServer((socket) => {
    // if --directory is not provided, the default directory is "public"
    // otherwise, the provided directory is used
    let httpHandler: HTTPHandler;
    if (process.argv.includes("--directory")) {
        const directoryIndex = process.argv.indexOf("--directory");
        const directory = process.argv[directoryIndex + 1];
        httpHandler = new HTTPHandler(directory);
    } else {
        httpHandler = new HTTPHandler("public");
    }

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