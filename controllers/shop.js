const {Shop,validateShop} = require('../models/Shop');
const bcrypt = require('bcrypt')



const register = async (req,res) => {
  const {error} = validateShop(req.body);
  if(error) return res.status(400).send(error.message);
  const {name,image,email,password,phone} = req.body;
  let shop = await new Shop({name,image,email,password,phone});
  const salt = await bcrypt.genSalt(10);
  shop.password = await bcrypt.hash(shop.password,salt);
  if(!shop) return res.status(500).send({error:{message: 'Something failed'}});
  shop = await shop.save()
  return res.status(201).send(shop);
}

const editShop = async (req,res) => {
  // const {error} = validateShop(req.body);
  // if(error) return res.status(400).send(error.message);
  const {name,image,email,oldPassword,newPassword,phone} = req.body;
  const oldInfo = await Shop.findById(req.params.id);
  const validatePass = await bcrypt.compare(oldPassword,oldInfo.password);
  if(!validatePass) return res.status(400).send({error:{message: 'Old password does not match !'}})
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(newPassword,salt);
  const shop = await Shop.findByIdAndUpdate(req.params.id,{name,image,email,password,phone});
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
  const shop = await Shop.findById(req.params.id);
  if(!shop) return res.status(500).send({error:{message: 'Something failed'}});
  return res.status(200).send(shop);
}

const deleteShop = async (req,res) =>{
  const shop = await Shop.findByIdAndDelete(req.params.id);
  if(!shop) return res.status(500).send({error:{message: 'Something failed'}});
  return res.status(200).send(shop);
}
//
// const login = (req,res) => {
//
// }

module.exports = {
  register,
  getAllShops,
  getSingleShop,
  deleteShop,
  editShop
}
