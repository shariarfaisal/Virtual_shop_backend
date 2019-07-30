const Admin = require('../models/Admin');
const joi = require('joi');
const bcrypt = require('bcrypt');

const registerValidator = (data) => {
  const schema = {
    name: joi.string().max(55).required(),
    userName: joi.string().max(100).required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required()
  }

  return joi.validate(data,schema);
}

const updateValidator = data => {
  const schema = {
    name: joi.string().max(55).required(),
    userName: joi.string().max(100).required(),
    oldPassword: joi.string().required(),
    newPassword: joi.string().required()
  }
    return joi.validate(data,schema);
}

const loginValidator = data => {
  const schema = {
    userName: joi.string().max(256).required(),
    password: joi.string().required()
  }
  return joi.validate(data,schema)
}

const login = async (req,res) => {
  const {error} = loginValidator(req.body);
  if(error) return res.status(400).send(error.message);
  const {userName,password} = req.body;
  const admin = await Admin.findOne({userName});
  if(!admin) return res.status(400).send("usernaem or password is invalid1");
  const isValidPass = await bcrypt.compare(password,admin.password);
  if(!isValidPass) return res.status(400).send("username or password is invalid2");
  const token = admin.getAdminToken();
  return res.header('admin_token',token).status(200).send(token);
}


const register = async (req,res) => {
  const {error} = registerValidator(req.body);
  if(error) return res.status(400).send(error.message);

  const {name,userName,password,confirmPassword} = req.body;
  if(password !== confirmPassword) return res.status(400).send("confirm password doesn't match with password !")
  const admin = await new Admin({name,userName,password});
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password,salt);
  await admin.save();
  if(!admin) return res.status(500).send("something wrong");
  return res.status(201).send(true);
}

const getUpdateAdmin = async (req,res) => {
  const {error} = updateValidator(req.body);
  if(error) return res.status(400).send(error.message);

  const {name,userName,oldPassword,newPassword} = req.body;
  const admin = await Admin.findById(req.admin._id);
  const oldPassIsValid = await bcrypt.compare(oldPassword,admin.password);
  if(!oldPassIsValid) return res.status(400).send("old password doesn't match!");
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(newPassword,salt);
  const updated = await Admin.findByIdAndUpdate({_id: req.admin._id},{$set: {name,userName,password}},{new: true});
  if(!updated) return  res.status(500).send("something wrong");
  return res.status(200).send(updated);
}

const getAllAdmin = async (req,res) => {
  const admins = await Admin.find();
  if(!admins) return res.status(500).send("something wrong");
  return res.status(200).send(admins);
}

const getSingleAdmin = async (req,res) => {
  const admin = await Admin.findById(req.params.adminId);
  if(!admin) return res.status(500).send("something wrong");
  return res.status(200).send(admin);
}

const getMe = async (req,res) => {
  const admin = await Admin.findById(req.admin._id);
  if(!admin) return res.status(500).send("something wrong");
  return res.status(200).send(admin);
}

const deleteAdmin = async (req,res) => {
  const admin = await Admin.findByIdAndDelete(req.params.adminId);
  if(!admin) return res.status(500).send("something wrong");
  return res.status(200).send(admin);
}

module.exports = {
  register,
  getAllAdmin,
  getSingleAdmin,
  getMe,
  deleteAdmin,
  login,
  getUpdateAdmin
}
