const express = require('express');
const db = require('./user-scheme');
const server = express();
const bcrypt = require('bcryptjs')
const auth = require('./authenticator');
const session = require('express-session')

const sessionConfig = {
   name: 'cookieName',
   secret: process.env.SECRET || 'someSecretString',
   resave: false,
   saveUninitialized: process.env.SEND_COOKIES || true,
   cookie: {
      maxAge: 1000 * 60 * 5, // good for 5 min in ms
      secure: process.env.USE_SECURE_COOKIES || false, // can be false over https only, set true in production. never ever send cookies over http
      httpOnly: true, // true = JS on client can NOT access the cookies
   }

}

server.use(express.json());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
   res.status(200).json({
      message: 'The API is running!'
   })
});

server.get('/users', auth, (req, res) => {
   db.find()
      .then(rep => {
         res.status(200).json({
            data: rep
         })
      })
});

server.post('/register', (req, res) => {

   const hashed = bcrypt.hashSync(req.body.password, 4);
   const newUser = {
      username: req.body.username,
      password: hashed
   };

   db.addUser(newUser)
   .then(rep => {
      res.status(201).json({
         data: rep
      })
   })
   .catch(err => {
      res.status(500).json({
         message: `Server error. ${err}`
      })
   })

});

server.post('/login', (req, res) => {

   db.findByUsername(req.body.username)
      .then(user => {

         if (user && bcrypt.compareSync(req.body.password, user[0].password)) {
            req.session.login = true;
            req.session.userId = user[0].id;
            res.status(200).json({
               message: `Login success`,
            });
         } else {
            res.status(400).json({
               message: `Login failed`
            });
         }

      })
      .catch(err => {
         res.status(500).json({
            message: `server error: ${err}`
         })
      });

});



module.exports = server;