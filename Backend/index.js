const restify = require('restify');
const fs = require('fs');
const path = require('path');
const { StatusCodes } = require('http-status-codes');

const server = restify.createServer();

server.get('/', (req, res, next) => {
    res.send(StatusCodes.OK, { message: 'Welcome to the User Management API' });
    next();
});

server.get('/health', (req, res, next) => {
    res.send(StatusCodes.OK, { status: StatusCodes.OK });
    next();
});

server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
