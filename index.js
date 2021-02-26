const express = require("express");
const app = express();
// const form = require('formidable');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require("http").Server(app);
const port = 8080;

app.use(express.static(__dirname + "/public"));
// app.use(express.urlencoded());
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

const mustacheExpress = require('mustache-express');
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

const mysql = require('mysql');
const db = mysql.createConnection({
    host     :   'localhost', 
    user     :    'root',
    password :    '',
    database :    'nodeapp'
});

// connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('mysql connected...');
});

// Create table
app.get('/createuserstable', (req, res) => {
    let sql = 'CREATE TABLE users(id int AUTO_INCREMENT, firstname VARCHAR(255), lastname VARCHAR(255), userPass VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('users table created...');
    });
});

// Insert into users table
// app.get('/adduser', (req, res) => {
//     let post = {firstname: 'James', lastname: 'Clack', userPass: 'tonyworld1360'};
//     let sql = 'INSERT INTO users SET ?';
//     let query = db.query(sql, post, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('user 1 added...')
//     });
// });

// Insert into users table From BackEnd
// app.get('/adduser1', (req, res) => {
//     let post = {firstname: 'Paul', lastname: 'Walker', userPass: 'tony123'};
//     let sql = "INSERT INTO users SET ?";
//     let query = db.query(sql, post, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('user 2 added');
//     });
// });

// Insert into users table From FrontEnd
app.post('/register', function(req, res) {
    let uName = req.body.user.uName;
    let lName = req.body.user.lName;
    let regPass = req.body.user.regPass;
    let log = req.session.Auth = {
        uName: uName
    }
    // let cPass = req.body.user.cPass;
    let post = {firstname: uName, lastname: lName, userPass: regPass};
    let sql = 'INSERT INTO users SET ?'; 
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.render('dashboard', log);
    });
});

// SELECT AND LOG A USER
app.post('/login', function(req, res){
    let uName = req.body.user.uName;
    let uPass = req.body.user.uPass;
    loginOpera(uName, uPass, req, res);
});
let loginOpera = (uName, uPass, req, res) => {
    if(uName && uPass){
        db.query('SELECT * FROM users WHERE firstname = ? AND userPass = ?', [uName, uPass], function(err, results){
            if(results.length > 0){
                let login = req.session.Auth = {
                    uName : uName
                }
                res.render('dashboard', login);
            } else {
                res.render('gateway', {
                    message: 'Invalid Username/Password',
                    msgType: 'danger'
                });
            } 
        });
    }
}

// LOGOUT SESSION 
app.get('/logout', (req, res) => {
    req.session.destroy(function(err){
        res.redirect('/');
    });
});
// Select users 
// app.get('/getusers', (req, res) => {
//     let sql = "SELECT * FROM users";
//     let query = db.query(sql, (err, results) => {
//         if(err) throw err;
//         console.log(results);
//         res.send('users fetched...');
//     });
// });

// Select users
// app.get('/getuser/:id', (req, res) => {
//     let sql = `SELECT * FROM users WHERE id = ${req.params.id}`;
//     let query = db.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('user fetched...');
//     });
// });

// Update users
// app.get('/updateuser/:id', (req, res) => {
//     let updateLName = 'Philip';
//     let sql = `UPDATE users SET lastname = '${updateLName}' WHERE id = ${req.params.id}`;
//     let query = db.query(sql, (err, result) => {
//         if(err) throw err; 
//         console.log(result);
//         res.send('user\'s lastname Updated...')
//     });
// });

// Delete user
// app.get('/deleteuser/:id', (req, res) => {
//     let sql = `DELETE FROM users WHERE id = ${req.params.id}`;
//     let query = db.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('user deleted...');
//     });
// });

app.get('/', function(req, res){
    let PageTitle = [
        {name: 'John Doe'},
        {name: 'Paul Walker'},
        {name: 'Philip Andrew'}
    ];
    res.render('index', {
        'title': PageTitle
    });
});
app.get('/categories', function(req, res){
    res.render('categories');
});
app.get('/contact', function(req, res){
    res.render('contact');
});
app.get('/gateway', function(req, res){
    res.render('gateway');
});

http.listen(port, () => {
    console.log("Running on Port: " + port);
});