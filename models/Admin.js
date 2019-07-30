const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken')
const config = require('config')


const adminSchema = new Schema({
  userName: {
    type: String,
    required: true,
    max: 256,
    trim: true
  },
  name: {
    type: String,
    required: true,
    max: 256
  },
  password: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now()
  }
})

adminSchema.methods.getAdminToken = function(){
  return jwt.sign({_id: this._id},config.get('jwtPrivatekey'));
}

const Admin = mongoose.model('admin',adminSchema);

module.exports = Admin;
