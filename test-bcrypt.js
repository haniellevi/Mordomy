const bcrypt = require('bcryptjs');
console.log('bcryptjs loaded successfully');
bcrypt.hash('test', 10).then(hash => console.log('Hash generated:', hash));
