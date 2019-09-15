const Customar = require('../models/Customar');
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const customarValidator = (data) => {
  const schema = {
    name: joi.string().min(1).max(55).required(),
    email: joi.string().min(1).max(255).required(),
    address: joi.string().min(1).max(255).required(),
    city: joi.string().min(1).max(255).required(),
    region: joi.string().min(1).max(55).required(),
    postal_code: joi.string().min(1).max(55).required(),
    country: joi.string().min(1).max(55).required(),
    phone: joi.string().min(1).max(55),
    password: joi.string().required(),
    confirmPassword: joi.string().required()
  }

  return joi.validate(data,schema);
}
const customarUpdateValidator = (data) => {
  const schema = {
    name: joi.string().min(1).max(55).required(),
    email: joi.string().min(1).max(255).required(),
    address: joi.string().min(1).max(255).required(),
    city: joi.string().min(1).max(255).required(),
    region: joi.string().min(1).max(55).required(),
    postal_code: joi.string().min(1).max(55).required(),
    country: joi.string().min(1).max(55).required(),
    phone: joi.string().min(1).max(55),
    password: joi.string().required()
  }

  return joi.validate(data,schema);
}

const loginValidator = (data) => {
  const schema = {
    email: joi.string().email().required(),
    password: joi.string().required()
  }
  return joi.validate(data,schema);
}

const login = async (req,res) => {
  console.log(req.body);
  const {error} = loginValidator(req.body);
  if(error) return res.status(400).send(error.message);
  const {email,password} = req.body;
  const customar = await Customar.findOne({email});
  if(!customar) return res.status(400).send({error: {message: "Email or password doesn't match! 1"}});
  const isValidPass = await bcrypt.compare(password,customar.password);
  if(!isValidPass) return res.status(400).send({error: {message: "Email or password doesn't match! 2"}});
  const token = await customar.getCustomarToken();
  res.header('customar_token',token).send(token);
}

const register = async (req,res) => {
  const {error} = customarValidator(req.body);
  if(error) return res.status(400).send(error.message);
  const {name,email,address,city,region,postal_code,country,phone,password,confirmPassword} = req.body;
  if(password !== confirmPassword) return res.status(400).send("confirm password doesn't match !")
  const customar = await new Customar({name,email,address,city,region,postal_code,country,phone,password})
  const salt = await bcrypt.genSalt(10);
  customar.password = await bcrypt.hash(customar.password,salt);
  await customar.save();
  if(!customar) return res.status(500).send("Something failed");
  return res.status(201).send(true);
}

const getUpdateCustomar = async (req,res) => {
  const {error} = customarUpdateValidator(req.body);
  if(error) return res.status(400).send(error.message);
  const {name,email,address,city,region,postal_code,country,phone,password} = req.body;
  const oldInfo = await Customar.findById(req.customar._id);
  const validatePass = await bcrypt.compare(password,oldInfo.password);
  if(!validatePass) return res.status(400).send({error: {message: "Password doesn't match !"}});
  // const salt = await bcrypt.genSalt(10);
  // const password = await bcrypt.hash(newPassword,salt);
  const updatedCustomar = await Customar.findByIdAndUpdate(req.customar._id,{$set: {name,email,address,city,region,postal_code,country,phone}},{new: true});
  if(!updatedCustomar) return res.status(500).send({error:{message: 'Server error occured'}})
  return res.status(200).send(updatedCustomar);
}



const getAllCustomar = async (req,res) => {
  const customars = await Customar.find();
  if(!customars) return res.status(500).send("Something failed");
  return res.status(201).send(customars);
}

const getSingleCustomar = async (req,res) => {
  const customar = await Customar.findById(req.params.id);
  if(!customar) return res.status(500).send("Something failed");
  return res.status(201).send(customar);
}

const getMyAccount = async (req,res) => {
  const customar = await Customar.findById(req.customar._id).populate('favourite.product').populate('favourite.product.shop').populate('follow.shop');
  if(!customar) return res.status(500).send("Something failed");
  return res.status(201).send(customar);
}


const getDeleteCustomar = async (req,res) => {
  const customar = await Customar.findByIdAndDelete(req.customar._id);
  if(!customar) return res.status(500).send("Something failed");
  return res.status(201).send(customar);
}

const favourite = async (req,res) => {
  const {product} = req.body;
  const customar = await Customar.findById(req.customar._id);
  if(!customar) return res.status(500).send("Something failed");
  const exist = customar.favourite.find(i => {
    return i.product == product
  })
  if(exist) {
    customar.favourite = customar.favourite.filter(i => i.product != product)
  }else{
    customar.favourite.push({product});
  }

  await customar.save();
  return res.status(200).send(customar.favourite);
}

const follow = async (req,res) => {
  const {shop} = req.body;
  const customar = await Customar.findById(req.customar._id);
  if(!customar) return res.status(500).send("Something failed");
  const exist = customar.follow.find(i => {
    return i.shop == shop
  })
  if(exist) {
    customar.follow = customar.follow.filter(i => i.shop != shop)
  }else{
    customar.follow.push({shop});
  }

  await customar.save();
  return res.status(200).send(customar.follow);
}


module.exports = {
  register,
  login,
  getAllCustomar,
  getSingleCustomar,
  getDeleteCustomar,
  getUpdateCustomar,
  getMyAccount,
  favourite,
  follow
}
