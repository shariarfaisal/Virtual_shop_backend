const mongoose = require('mongoose');
const joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')

const Schema = mongoose.Schema;

const shopSchema = new Schema({
  name: {
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

const validateShop = (Shop) => {
  const schema = {
    name: joi.string().min(3).max(100).required(),
    email: joi.string().max(200).required(),
    password: joi.string().min(5).max(256).required(),
    confirmPassword: joi.string().max(256).required(),
    phone: joi.string()
  }

  return joi.validate(Shop,schema);
}

shopSchema.methods.getShopToken = function(){
  return jwt.sign({_id:this._id,email: this.email},config.get('jwtPrivatekey'));
}

const Shop = mongoose.model('shop',shopSchema);

module.exports = {
  Shop,
  validateShop
};
