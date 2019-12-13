const express = require('express');
const path = require('path');
// const cors = require('cors');
const app = express();
const PORT = 3000;

// app.use(cors());
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/user/home.html'));
});

app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/user/login.html'));
});

app.get('/register', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/user/register.html'));
});

app.use(function(req, res) {
    res.status(404);
    res.send('404: File Not Found');
});

app.listen(PORT, function () {
    console.log('Example app listening on port 3000!');
});