const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const adminRoute = require('./routes/admin2');
const shopRoute = require('./routes/home');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(adminRoute);
app.use(shopRoute);
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));});
app.listen(7000);