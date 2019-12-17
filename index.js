const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

// route for user
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/user/home.html'));
});

app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/user/login.html'));
});

app.get('/register', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/user/register.html'));
});

// route for merchant
app.get('/merchant', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/merchant/home.html'));
});

app.get('/merchant/login', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/merchant/login.html'));
});

// route for admin
app.get('/admin', function (req, res) {
  res.redirect('/admin/users');
});

app.get('/admin/users', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/admin/users.html'));
});

app.get('/admin/login', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/admin/login.html'));
});

app.use(function(req, res) {
    res.status(404);
    res.send('404: File Not Found');
});

app.listen(PORT, function () {
    console.log('Example app listening on port 3000!');
});