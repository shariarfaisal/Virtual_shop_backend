const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String
  }
})

const Shop = mongoose.model('shop',shopSchema);
