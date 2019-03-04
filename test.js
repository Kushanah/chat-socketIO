const {Pool, Client} = require('pg');
const user = require('./module/user');
const db = new Pool({connectionString : 'postgresql://nodeA:lisemi@localhost:5432/chat',});
