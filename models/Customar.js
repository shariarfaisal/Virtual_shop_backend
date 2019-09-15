const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const config = require('config')
const Schema = mongoose.Schema;


const customarSchema = new Schema({
  name:{
    type: String,
    required: true,
    min: 3,
    max: 33,
    trim: true
  },
  email: {
    type: String,
    min: 1,
    max: 255,
    required: true,
    unique: true
  },
  address: {
    type: String,
    min: 1,
    max: 255,
    required: true,
  },
  phone: {
    type: String,
    min: 1,
    max: 50
  },
  city: {
    type: String,
    min: 2,
    max: 100,
    required: true,
  },
  region: {
    type: String,
    min: 1,
    max: 255,
    required: true,
  },
  postal_code: {
    type: String,
    min: 1,
    max:20,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    min: 5,
    required: true,
  },
  favourite: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product'
    }
  }],
  follow: [{
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'shop'
    }
  }]
})

customarSchema.methods.getCustomarToken = function(){
  return jwt.sign({_id: this._id,email: this.email},config.get('jwtPrivatekey'));
}

const Customar = mongoose.model('customar',customarSchema);

module.exports = Customar;
