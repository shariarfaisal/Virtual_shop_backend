const Category = require('../models/Category');

const postCategory = async (req,res) => {
  const {name} = req.body;
  const category = await new Category({name});
  if(!category) return res.status(500).send({error: {message: "Something wrong"}})
  await category.save()
  return res.status(201).send(category);
}

const getAllCategory = async (req,res) => {
  const category = await Category.find();
  if(!category) return res.status(500).send({error: {message: "Something wrong!"}});
  return res.status(200).send(category);
}

const getSingleCategory = async (req,res) => {
  const category = await Category.findByID(req.params.id);
  if(!category) return res.status(500).send({error: {message: "Something wrong!"}});
  return res.status(200).send(category);
}

const getUpdateCategory = async (req,res) => {
  const {name} = req.body;
  const category = await Category.findByIdAndUpdate(req.params.id,{$set: {name}},{new: true});
  if(!category) return res.status(500).send({error: {message: "Something wrong!"}})
  return res.status(201).send(category);
}

const deleteCategory = async (req,res) => {
  let category = await Category.findByIdAndDelete(req.params.id);
  if(!category) return res.status(500).send({error: {message: "Something wrong"}});
  return res.status(200).send(category);
}

module.exports = {
  postCategory,
  getAllCategory,
  getSingleCategory,
  getUpdateCategory,
  deleteCategory
}
