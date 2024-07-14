import * as net from 'net';
import {RequestHandler} from './requestHandler';

const server = net.createServer((socket: net.Socket) => {
    socket.on('data', (data) => {
        const handler = new RequestHandler(socket, data);
        handler.handleRequest();
    });
});

server.listen(4221, 'localhost', () => {
    console.log('Server is listening on localhost:4221');
});
