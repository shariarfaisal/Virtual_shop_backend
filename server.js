const express = require('express');
const app = express();
const port = process.env.PORT || 1000 ;

require('./startup/db')();
require('./startup/config')();
require('./startup/routes')(app);

app.use(express.static('uploads'))

app.listen(port,() => {
  console.log(`port is running port ${port}`)
})
