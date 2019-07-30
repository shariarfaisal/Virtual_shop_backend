const Customar = require('../models/Customar');
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const customarValidator = (data) => {
  const schema = {
    name: joi.string().min(1).max(55).required(),
    email: joi.string().min(1).max(255).required(),
    address_1: joi.string().min(1).max(255).required(),
    address_2: joi.string().min(1).max(255).required(),
    city: joi.string().min(1).max(255).required(),
    region: joi.string().min(1).max(55).required(),
    postal_code: joi.string().min(1).max(55).required(),
    country: joi.string().min(1).max(55).required(),
    phone: joi.string().min(1).max(55),
    creditCard: joi.string().min(1).required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required()
  }

  return joi.validate(data,schema);
}
const customarUpdateValidator = (data) => {
  const schema = {
    name: joi.string().min(1).max(55).required(),
    email: joi.string().min(1).max(255).required(),
    address_1: joi.string().min(1).max(255).required(),
    address_2: joi.string().min(1).max(255).required(),
    city: joi.string().min(1).max(255).required(),
    region: joi.string().min(1).max(55).required(),
    postal_code: joi.string().min(1).max(55).required(),
    country: joi.string().min(1).max(55).required(),
    phone: joi.string().min(1).max(55),
    creditCard: joi.string().min(1).required(),
    oldPassword: joi.string().required(),
    newPassword: joi.string().required()
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
  const {error} = loginValidator(req.body);
  if(error) return res.status(400).send(error.message);
  const {email,password} = req.body;
  const customar = await Customar.findOne({email});
  if(!customar) return res.status(400).send({error: {message: "Email or password doesn't match!"}});
  const isValidPass = await bcrypt.compare(password,customar.password);
  if(!isValidPass) return res.status(400).send({error: {message: "Email or password doesn't match!"}});
  const token = await customar.getCustomarToken();
  res.header('customar_token',token).send(token);
}

const register = async (req,res) => {
  const {error} = customarValidator(req.body);
  if(error) return res.status(400).send(error.message);
  const {name,email,address_1,address_2,city,region,postal_code,country,phone,creditCard,password,confirmPassword} = req.body;
  if(password !== confirmPassword) return res.status(400).send("confirm password doesn't match !")
  const customar = await new Customar({name,email,address_1,address_2,city,region,postal_code,country,phone,creditCard,password})
  const salt = await bcrypt.genSalt(10);
  customar.password = await bcrypt.hash(customar.password,salt);
  await customar.save();
  if(!customar) return res.status(500).send("Something failed");
  return res.status(201).send(customar);
}

const getUpdateCustomar = async (req,res) => {
  const {error} = customarUpdateValidator(req.body);
  if(error) return res.status(400).send(error.message);
  const {name,email,address_1,address_2,city,region,postal_code,country,phone,creditCard,oldPassword,newPassword} = req.body;
  const oldInfo = await Customar.findById(req.customar._id);
  const validatePass = await bcrypt.compare(oldPassword,oldInfo.password);
  if(!validatePass) return res.status(400).send({error: {message: "Old password doesn't match !"}});
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(newPassword,salt);
  const updatedCustomar = await Customar.findByIdAndUpdate(req.customar._id,{$set: {name,email,address_1,address_2,city,region,postal_code,country,phone,creditCard,password}},{new: true});
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
  const customar = await Customar.findById(req.customar._id);
  if(!customar) return res.status(500).send("Something failed");
  return res.status(201).send(customar);
}


const getDeleteCustomar = async (req,res) => {
  const customar = await Customar.findByIdAndDelete(req.customar._id);
  if(!customar) return res.status(500).send("Something failed");
  return res.status(201).send(customar);
}

module.exports = {
  register,
  login,
  getAllCustomar,
  getSingleCustomar,
  getDeleteCustomar,
  getUpdateCustomar,
  getMyAccount
}
