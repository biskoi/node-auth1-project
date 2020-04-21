const db = require('./data/db-config')

module.exports = {
   find,
   findByUsername,
   addUser
}

function find() {
   return db('users');
}

function findByUsername(user) {
   return db('users')
      .where({username: user})
}

function addUser(newUser) {
   return db('users')
      .insert(newUser)
      .then(rep => {
         return rep;
      });
}