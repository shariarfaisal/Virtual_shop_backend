const jwt = require('jsonwebtoken');
const config = require('config');

const adminAuth = (req,res,next) => {
  const token = req.header('admin_token');
  if(!token) return res.status(401).send("You are not authenticated!");
  try{
    const decoded = jwt.verify(token,config.get('jwtPrivatekey'));
    req.admin = decoded;
    next()
  }catch(e){
    if(e) return res.status(400).send("inValid token")
  }
}

module.exports = adminAuth;
