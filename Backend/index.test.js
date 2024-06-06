const assert = require('assert');
const http = require('http');
const fs = require('fs');
const path = require('path');
const server = require('./index');

const DATA_FILE = path.join(__dirname, '../users.csv');

const makeRequest = (options, data, callback) => {
    const req = http.request(options, (res) => {
         let body = '';
         res.on('data', chunk => {body += chunk; });
         res.on('end', () => {callback(null, res, body);});
    });

    req.on('error', (e) => {
        callback(e);
    });

    if(data) {
        req.write(data);
    }

    req.end();
};

describe('User Management', () => {
    beforeEach((done) => {
        fs.writeFileSync(DATA_FILE, '1,duncan,vodden\n2,esti,cronje');
        server.listen(8080,done);
    });

    afterEach((done) => {
        server.close(done);
    });

    it('should return health status', (done) => {
        makeRequest({ hostname: 'localhost', port: 8080, path: '/health', method: 'GET' }, null, (err, res, body) => {
            assert.strictEqual(res.statusCode, 200);
            assert.deepStrictEqual(JSON.parse(body), { status: 200 });
            done();
        });
    });
});