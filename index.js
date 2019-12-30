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

app.get('/profile', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/user/profile.html'));
});

app.get('/orders', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/user/order.html'));
});

app.get('/payment', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/user/payment.html'));
});

app.get('/cart', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/user/cart.html'));
});

app.get('/wishlist', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/user/wishlist.html'));
});

app.get('/orders/:id', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/user/order-detail.html'));
});

app.get('/books/:sku', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/user/book-detail.html'));
});

app.get('/merchants/:id', function(req, res){
  res.sendFile(path.join(__dirname + '/views/user/merchant.html'));
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


app.get('/admin/login', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/admin/login.html'));
});

app.get('/admin/profile', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/admin/profile.html'));
});

app.get('/admin/users', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/admin/users.html'));
});

app.get('/admin/users/:id', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/admin/detail-user.html'));
});

app.get('/admin/users/:id/edit', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/admin/edit-user.html'));
});

// router for other
app.get('/404', function (req, res) {
  res.status(404);
  res.send('404: Page Not Found');
});

app.use(function(req, res) {
  res.status(404);
  res.send('404: Page Not Found');
});

app.listen(PORT, function () {
    console.log('Example app listening on port 3000!');
});