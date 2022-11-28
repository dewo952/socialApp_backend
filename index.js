const bodyParser = require('body-parser');
const express = require('express');
const port = 3000;
const app = express();

require('./database');
require('./models/Usermodel');

const authRoutes = require('./routes/authRoutes');

app.use(bodyParser.json());
app.use(authRoutes);
app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(port, ()=> {
    console.log('Server is running on port' + port);
})