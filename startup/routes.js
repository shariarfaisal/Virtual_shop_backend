const Shop = require('../routes/shop')
const Category = require('../routes/category');
const Product = require('../routes/product');
const Customar = require('../routes/customar');
const Admin = require('../routes/admin');
const morgan = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser');

module.exports = function (app) {

  app.use(morgan('dev'))
  app.use(cors())
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use('/api/shop',Shop);
  app.use('/api/category',Category);
  app.use('/api/product',Product);
  app.use('/api/customar',Customar);
  app.use('/api/admin',Admin);

}
