const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({

})

const Product = mongoose.model('products',productSchema);

module.exports = Product;
