const Product = require('../models/Product');
const joi = require('joi');
joi.objecId = require('joi-objectid')(joi);
const fs = require('fs')

const multer = require('multer');
const upload = multer({dest: '/uploads'})


const postValidator = (data) => {
  const schema = {
    title: joi.string().min(3).max(155).required(),
    shop: joi.objecId().required(),
    category: joi.objecId().required(),
    price: joi.number().required(),
    image: joi.string().required(),
    description: joi.string().min(10),
    tags: joi.string()
  }
  return joi.validate(data,schema);
}

const updateValidator = (data) => {
  const schema = {
    title: joi.string().min(3).max(155).required(),
    category: joi.objecId().required(),
    price: joi.number().required(),
    description: joi.string().min(10),
    tags: joi.string()
  }
  return joi.validate(data,schema);
}


const getPostProduct = async (req,res) => {
  const {error} = postValidator({...req.body,shop: req.shop._id,image: req.file.filename});
  if(error) return res.status(400).send({error: {message: error.message}})
  const {title,category,price,image,description,tags} = req.body;
  const convertTags = tags.split(',');
  const product = await new Product({title,tags: convertTags,shop: req.shop._id,category,price,image: req.file.filename,description});
  if(!product) return res.status(500).send({error: {message: "Something failed"}})
  await product.save();
  return res.status(201).send(product);
}


const getUpdateProduct = async (req,res) => {
  const {error} = updateValidator(req.body);
  if(error) return res.send({error: {message: error.message}})
  const {title,category,price,description,tags} = req.body;
  const finalTags = tags.split(',');
  const product = await Product.findByIdAndUpdate({_id:req.params.id},{$set: {title,category,price,description,tags: finalTags}},{new: true});
  if(!product) return res.status(500).send({error: {message: "Something failed"}})
  return res.status(201).send(product);
}

const getProductsWithShopId = async (req,res) => {
  const products = await Product
                            .find({shop: req.shop._id})
                            .populate('shop')
                            .populate('category').sort({_id: -1});
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
  // const searches = JSON.parse(req.header('virtual_search')).searches
  const pro = await Product.find().populate('shop').populate('category').sort('_id');
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
  fs.unlink(`./uploads/${pro.image}`, err => {
    if(err){
      console.log(err);
      return
    }
  })
  return res.status(200).send('succesfully deleted product');
}


const getReview = async (req,res) => {
  const product = await Product.findOne({_id: req.customar._id});
  if(!product) return res.status(500).send({error: {message: "Something failed"}});
  const isHave = product.reviews.find(i => i.customar == req.customar._id);
  product.reviews.push({customar: req.customar._id,comment: req.body.comment,rating: req.body.rating});
  await product.save();
  return res.status(201).send(true);
}

const search = async (req,res) => {
  let products = await Product.find().populate('shop').populate('category');
  const reg = new RegExp(`${req.params.search}`,'gi')
  products = products.filter(i => {
    const tag = i.tags.join('');
    if(i.title.match(reg)) return true
    if(tag.match(reg)) return true
     return false
  })
  return res.send(products)
}


module.exports = {
  getPostProduct,
  getAllProduct,
  getSingleProduct,
  getDeleteProduct,
  getUpdateProduct,
  getProductsWithShopId,
  getProductsWithCategoryId,
  search
}
