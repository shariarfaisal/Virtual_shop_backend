const express = require('express');
const app = express();
const port = process.env.PORT || 1000 ;
const morgan = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/turing',{useNewUrlParser: true},() => {
  console.log('Database connection established succesfully');
})


app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use('/',(req,res) => {
  res.send('hello world')
})

app.listen(port,() => {
  console.log(`port is running port ${port}`)
})
