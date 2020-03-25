const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const mongoose = require('mongoose');


const { port: serverPort } = config.get('serverConfig');
const { port, name, protocol, host } = config.get('dbConfig');
const bdUrl = `${protocol}://${host}:${port}/${name}`;

mongoose.connect(bdUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoBD connected'))
    .catch((err) => console.error('Error. MongoBD not connected.', err));

const app = express();

const log = require('./src/middleware/log');

const Schema = mongoose.Schema;
const schema = new Schema({
    name: String,
    password: String,
}, {
    capped: { size: 1024 },
    bufferCommands: false,
    autoCreate: false,
});

const User = mongoose.model('User', schema);
User.createCollection();

app.get('/test', (req, res) => {
    res.status(200).json({ status: 'ok' });
    res.end();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(log);

app.listen(serverPort, () => console.log(`Server is running on port: ${serverPort}`));
