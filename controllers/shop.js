const {Shop,validateShop} = require('../models/Shop');
const bcrypt = require('bcrypt')
const joi = require('joi');


const validateUpdatedData = (data) => {
  const schema = {
    name: joi.string().min(3).max(100).required(),
    email: joi.string().max(255).required(),
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
    phone: joi.string().max(20).required()
  }

  return joi.validate(data,schema);
}

const loginValidator = (data) => {
  const schema = {
    email: joi.string().required(),
    password: joi.string().required()
  }
  return joi.validate(data,schema);
}

const login = async (req,res) => {
  const {error} = loginValidator(req.body);
  if(error) return res.send({error: {message: error.message}});
  const {email,password} = req.body
  const prevData = await Shop.findOne({email});
  if(!prevData) return res.send({error: {message: 'Email or password is invalid!'}})
  const checkPassword = await bcrypt.compare(password,prevData.password);
  if(!checkPassword) return res.send({error: {message: 'Email or password is invalid!'}})
  const token = prevData.getShopToken();
  return res.header('virtual_shopkeeper_token',token).send(token);
}


const register = async (req,res) => {
  const {error} = validateShop(req.body);
  if(error) return res.status(400).send({error: {message: error.message}});
  const {name,email,password,confirmPassword,phone} = req.body;
  if(password !== confirmPassword) return res.status(400).send({error: {message: "password doesn't match!"}});
  let shop = await new Shop({name,email,password,phone});
  const salt = await bcrypt.genSalt(10);
  shop.password = await bcrypt.hash(shop.password,salt);
  if(!shop) return res.status(500).send({error:{message: 'Something failed'}});
  await shop.save()
  return res.status(201).send(true);
}

const editShop = async (req,res) => {
  const {error} = validateUpdatedData(req.body);
  if(error) return res.status(400).send({error: {message: error.message}});
  const {name,email,oldPassword,newPassword,phone} = req.body;
  const oldInfo = await Shop.findById(req.shop._id);
  const validatePass = await bcrypt.compare(oldPassword,oldInfo.password);
  if(!validatePass) return res.status(400).send({error:{message: 'Old password does not match !'}})
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(newPassword,salt);
  const shop = await Shop.findByIdAndUpdate({_id: req.shop._id},{$set:{name,email,password,phone}},{new:true});
  await shop.save();
  if(!shop) return res.status(500).send({error:{message: 'Server error occured'}})
  return res.status(200).send(shop);
}


const getAllShops = async (req,res) => {
  const shops = await Shop.find();
  if(!shops) return res.status(500).send({error:{message: 'Something failed'}});
  return res.status(200).send(shops);
}

const getSingleShop = async (req,res) => {
  const shop = await Shop.findById(req.shop._id);
  if(!shop) return res.status(500).send({error:{message: 'Something failed'}});
  return res.status(200).send(shop);
}

const deleteShop = async (req,res) =>{
  const shop = await Shop.findByIdAndDelete(req.shop._id);
  if(!shop) return res.status(500).send({error:{message: 'Something failed'}});
  return res.status(200).send(shop);
}

// const addShopCategory = async (req,res) => {
//   const {category} = req.body;
//   const shop = await Shop.findOne({_id: req.shop._id});
//   shop.categories.push({category});
//   await shop.save();
//   if(!shop) return res.status(500).send({error: {message: "Something wrong"}})
//   return res.status(200).send(shop);
// }
//
// const removeShopCategory = async (req,res) => {
//   const {category} = req.body;
//   const shop = await Shop.findOne({_id: req.shop._id});
//   shop.categories = hop.categories.filter(i => {
//     return i.category != category;
//   })
//   await shop.save();
//   if(!shop) return res.status(500).send({error: {message: "Something wrong"}})
//   return res.status(200).send(shop);
// }


module.exports = {
  register,
  getAllShops,
  getSingleShop,
  deleteShop,
  editShop,
  login
}
