const Product = require('../models/Product');
const joi = require('joi');
joi.objecId = require('joi-objectid')(joi);


const multer = require('multer');
const upload = multer({dest: '/uploads'})




const postValidator = (data) => {
  const schema = {
    title: joi.string().min(3).max(155).required(),
    shop: joi.objecId().required(),
    category: joi.objecId().required(),
    price: joi.number().required(),
    image: joi.string().required(),
    description: joi.string().min(10)
  }
  return joi.validate(data,schema);
}

const updateValidator = (data) => {
  const schema = {
    title: joi.string().min(3).max(155).required(),
    category: joi.objecId().required(),
    price: joi.number().required(),
    description: joi.string().min(10)
  }
  return joi.validate(data,schema);
}


const getPostProduct = async (req,res) => {
  const {error} = postValidator({...req.body,shop: req.shop._id,image: req.file.filename});
  if(error) return res.status(400).send({error: {message: error.message}})
  const {title,category,price,image,description} = req.body;
  const product = await new Product({title,shop: req.shop._id,category,price,image: req.file.filename,description});
  if(!product) return res.status(500).send({error: {message: "Something failed"}})
  await product.save();
  return res.status(201).send(product);
}


const getUpdateProduct = async (req,res) => {
  const {error} = updateValidator(req.body);
  if(error) return res.send({error: {message: error.message}})
  const {title,category,price,description} = req.body;
  const product = await Product.findByIdAndUpdate({_id:req.params.id},{$set: {title,category,price,description}},{new: true});
  if(!product) return res.status(500).send({error: {message: "Something failed"}})
  return res.status(201).send(product);
}

const getProductsWithShopId = async (req,res) => {
  const products = await Product
                            .find({shop: req.shop._id})
                            .populate('shop')
                            .populate('category');
  if(!products) return res.status(500).send({error: {message: 'Something failed!'}});
  return res.status(200).send(products);
}


const getProductsWithCategoryId = async (req,res) => {
  const products = await Product
                            .find({category: req.params.categoryId})
                            .populate('shop')
                            .populate('category');
  if(!products) return res.status(500).send({error: {message: 'Something failed!'}});
  return res.status(200).send(products);
}


const getAllProduct = async (req,res) => {
  const pro = await Product.find().populate('shop');
  if(!pro) return res.status(500).send({error: {message: 'Something failed!'}});
  return res.status(200).send(pro);
}

const getSingleProduct= async (req,res) => {
  const pro = await Product.findById(req.params.id).populate('shop').populate('category');
  if(!pro) return res.status(500).send({error: {message: 'Something failed!'}});
  return res.status(200).send(pro);
}

const getDeleteProduct = async (req,res) => {
  const pro = await Product.findByIdAndDelete(req.params.id)
  if(!pro) return res.status(500).send({error: {message: 'Something failed!'}});
  // const category = await Category.findOneAndDelete({shop: pro._id})
  // if(!category) return res.status(500).send({error: {message: " Something wrong product delete category"}})
  return res.status(200).send('succesfully deleted product');
}

module.exports = {
  getPostProduct,
  getAllProduct,
  getSingleProduct,
  getDeleteProduct,
  getUpdateProduct,
  getProductsWithShopId,
  getProductsWithCategoryId
}
