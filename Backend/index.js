const restify = require('restify');
const fs = require('fs');
const path = require('path');
const { StatusCodes } = require('http-status-codes');

const server = restify.createServer();

server.use(restify.plugins.bodyParser());

const DATA_FILE = path.join(__dirname, 'users.csv');

const readCSV = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '');
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return data.trim().split('\n').filter(line => line).map(line => {
        const [id, name, surname] = line.split(',');
        return { id, name, surname };
    });
};

const writeCSV = (data) => {
    const csv = data.map(user => `${user.id},${user.name},${user.surname}`).join('\n');
    fs.writeFileSync(DATA_FILE, csv);
};

server.get('/', (req, res, next) => {
    res.send(StatusCodes.OK, { message: 'Welcome to the User Management API' });
    next();
});

server.get('/health', (req, res, next) => {
    res.send(StatusCodes.OK, { status: StatusCodes.OK });
    next();
});

server.get('/users', (req, res, next) => {
    const users = readCSV();
    res.send(StatusCodes.OK, [users]);
    next();
});

server.get('/users/:id', (req, res, next) => {
    const users = readCSV();
    const user = users.find(u => u.id === req.params.id);
    if (user) {
        res.send(StatusCodes.OK, user);
    } else {
        res.send(StatusCodes.NOT_FOUND, { message: 'User not found' });
    }
    next();
});

server.post('/users', (req, res, next) => {
    const { name, surname } = req.body;
    if (!name || !surname) {
        res.send(StatusCodes.BAD_REQUEST, { message: 'Name and surname are required' });
        return next();
    }
    const users = readCSV();
    const id = (users.length ? Math.max(...users.map(u => parseInt(u.id))) + 1 : 1).toString();
    const user = { id, name, surname };

    if (users.some(u => u.name === name && u.surname === surname)) {
        res.send(StatusCodes.CONFLICT, { message: 'User already exists' });
    } else {
        users.push(user);
        writeCSV(users);
        res.send(StatusCodes.CREATED, user);
    }
    next();
});

server.del('/users/:id', (req, res, next) => {
    let users = readCSV();
    const initialLength = users.length;
    users = users.filter(u => u.id !== req.params.id);

    if (users.length === initialLength) {
        res.send(StatusCodes.NOT_FOUND, { message: 'User not found' });
    } else {
        writeCSV(users);
        res.send(StatusCodes.NO_CONTENT);
    }
    next();
});

server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
