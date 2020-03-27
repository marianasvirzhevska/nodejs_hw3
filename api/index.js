const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const mongoose = require('mongoose');
const registerRoute = require('./src/routes/register');
const loginRoute = require('./src/routes/login');
const profileRoute = require('./src/routes/profile');

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
const auth = require('./src/middleware/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(log);


app.use(registerRoute);
app.use(loginRoute);
app.use(auth);

app.use(profileRoute);

app.listen(serverPort, () => console.log(`Server is running on port: ${serverPort}`));
