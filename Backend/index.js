const restify = require('restify');
const fs = require('fs');
const path = require('path');

const server = restify.createServer();

server.use(restify.plugins.bodyParser());

const DATA_FILE = path.join(__dirname, 'users.csv');

const readCSV = () => {

    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return data.trim().split('\n').filter(line => line).map(line => {
        const [id, name, surname] = line.split(',');
        return { id, name, surname };
    });
};

server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
