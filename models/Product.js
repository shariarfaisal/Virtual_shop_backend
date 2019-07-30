const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prodcutSchema = new Schema({
  title:{
    type: String,
    required: true,
    min: 3,
    max: 155
  },
  shop:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'shop'
  },
  category:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
  },
  price:{
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    min: 10,
    max: 5000,
  },
  time: {
    type: Date,
    default: Date.now()
  }
})

const Product = mongoose.model('product',prodcutSchema);

module.exports = Product;
