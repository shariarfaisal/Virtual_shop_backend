const Shop = require('../models/Shop');

const register = async (req,res) => {
  const {name,image,email,phone} = req.body;
  let shop = await new Shop({name,image,email,phone});
  if(!shop) return res.status(500).send({error:{message: 'Something failed'}});
  shop = await shop.save()
  return res.status(201).send(shop);
}

// const getAllShops = (req,res) => {
//
// }
//
// const getSingleShop = (req,res) => {
//
// }
//
// const login = (req,res) => {
//
// }

module.exports = {
  register,
}
