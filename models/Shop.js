const mongoose = require('mongoose');
const joi = require('joi')
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
  password:{
    type: String,
    required: true
  },
  phone: {
    type: String
  }
})

const Shop = mongoose.model('shop',shopSchema);

const validateShop = (Shop) => {
  const schema = {
    name: joi.string().min(3).max(100).required(),
    image: joi.string().required(),
    email: joi.string().max(200).required(),
    password: joi.string().min(5).required(),
    phone: joi.string()
  }

  return joi.validate(Shop,schema);
}



module.exports = {
  Shop,
  validateShop
};
