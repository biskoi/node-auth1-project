const express = require('express');
const db = require('./user-scheme');
const server = express();
const bcrypt = require('bcryptjs')
server.use(express.json());

server.get('/', (req, res) => {
   res.status(200).json({
      message: 'The API is running!'
   })
});

server.get('/users', (req, res) => {
   db.find()
      .then(rep => {
         res.status(200).json(rep)
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
            res.status(200).json({
               message: `Login success`
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