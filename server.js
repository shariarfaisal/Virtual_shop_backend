const express = require('express');
const app = express();

require('./startup/db')();
require('./startup/config')();
require('./startup/routes')(app);

app.use(express.static('uploads'))

const PORT = process.env.PORT || 1000;
const server = app.listen(PORT,() => {
  console.log(`Listening on port ${PORT}`);
})
module.exports = server
