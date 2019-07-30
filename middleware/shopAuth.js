const jwt = require('jsonwebtoken');
const config = require('config');
const shopAuth = (req,res,next) => {
  const token = req.header('virtual_shopkeeper_token');
  if(!token) return res.status(401).send("you are unauthorized");
  try{
    const decoded = jwt.verify(token,config.get('jwtPrivatekey'));
    req.shop = decoded;
    next();
  }catch(e){
    return res.status(400).send('invalid token');
  }
}

module.exports = shopAuth;
