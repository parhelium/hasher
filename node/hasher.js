var read = require('read');
var clipboard = require('clipboard');

read({ prompt: 'Master password:', silent: true }, function(er, password) {
  console.log('Password was copied to clipboard. You have 30 sec to use it, after that it clipboard will be cleared.');
  clipboard.clear();
  clipboard.write(password);
})
