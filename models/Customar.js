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
  },
  address_1: {
    type: String,
    min: 1,
    max: 255,
    required: true,
  },
  address_2: {
    type: String,
    min: 1,
    max: 255,
    required: true,
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
  creditCard: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    min: 5,
    required: true,
  }
})

customarSchema.methods.getCustomarToken = function(){
  return jwt.sign({_id: this._id,email: this.email},config.get('jwtPrivatekey'));
}

const Customar = mongoose.model('customar',customarSchema);

module.exports = Customar;
