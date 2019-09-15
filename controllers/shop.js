const {Shop,validateShop} = require('../models/Shop');
const bcrypt = require('bcrypt')
const joi = require('joi');
const fs = require('fs')

const validateUpdatedData = (data) => {
  const schema = {
    name: joi.string().min(3).max(100).required(),
    email: joi.string().max(255).required(),
    password: joi.string().required(),
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
  const {name,email,password,confirmPassword,phone,country} = req.body;
  if(password !== confirmPassword) return res.status(400).send({error: {message: "password doesn't match!"}});
  let shop = await new Shop({name,email,password,phone,country});
  const salt = await bcrypt.genSalt(10);
  shop.password = await bcrypt.hash(shop.password,salt);
  if(!shop) return res.status(500).send({error:{message: 'Something failed'}});
  await shop.save()
  return res.status(201).send(true);
}

const editShop = async (req,res) => {
  const {error} = validateUpdatedData(req.body);
  if(error) return res.status(400).send({error: {message: error.message}});
  const {name,email,phone,password} = req.body;
  const info = await Shop.findById(req.shop._id);
  const validatePass = await bcrypt.compare(password,info.password);
  if(!validatePass) return res.status(400).send({error:{message: 'Password does not match !'}})
  // const salt = await bcrypt.genSalt(10);
  // const password = await bcrypt.hash(newPassword,salt);
  const shop = await Shop.findByIdAndUpdate({_id: req.shop._id},{$set:{name,email,phone}},{new:true});
  await shop.save();
  if(!shop) return res.status(500).send({error:{message: 'Server error occured'}})
  return res.status(200).send(shop);
}


const getAllShops = async (req,res) => {
  const shops = await Shop.find().select(' -password ');
  if(!shops) return res.status(500).send({error:{message: 'Something failed'}});
  return res.status(200).send(shops);
}

const getSingleShop = async (req,res) => {
  const shop = await Shop.findById(req.shop._id);
  if(!shop) return res.status(500).send({error:{message: 'Something failed'}});
  return res.status(200).send(shop);
}

const getShopById = async (req,res) => {
  const shop = await Shop.findById(req.params.id);
  if(!shop) return res.status(500).send({error:{message: 'Something failed'}});
  return res.status(200).send(shop);
}

const deleteShop = async (req,res) =>{
  const shop = await Shop.findByIdAndDelete(req.shop._id);
  if(!shop) return res.status(500).send({error:{message: 'Something failed'}});
  return res.status(200).send(shop);
}

const imageUpload = async (req,res) => {
  const shop = await Shop.findById(req.shop._id)
  if(!shop) return res.status(500).send({error: {message: "Something wrong"}})
  if(req.file.filename){
    fs.unlink(`./uploads/${shop.image}`, err => {
      if(err) {
        console.log(err);
        return
      }
    })
  }
  shop.image = req.file.filename;
  await shop.save();
  return res.status(201).send(shop)
}

const addAbout = async (req,res) => {
  const shop = await Shop.findById(req.shop._id);
  if(!shop) return res.status(500).send({error: {message: "Something wrong"}})
  shop.about = req.body.about;
  await shop.save();
  return res.status(200).send(shop);
}

const changePassword = async (req,res) => {
  const {oldPassword,newPassword} = req.body;
  const shop = await Shop.findById(req.shop._id)
  if(!shop) return res.status(500).send({error: {message: "Something wrong"}})
  const validatePass = await bcrypt.compare(oldPassword,shop.password);
  if(!validatePass) return res.status(400).send({error:{message: 'Password does not match !'}})
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(newPassword,salt);
  const update = await Shop.findByIdAndUpdate(req.shop._id,{$set: {password}},{new: true});
  return res.status(200).send(update);
}


module.exports = {
  register,
  getAllShops,
  getSingleShop,
  deleteShop,
  editShop,
  login,
  imageUpload,
  addAbout,
  changePassword,
  getShopById
}
