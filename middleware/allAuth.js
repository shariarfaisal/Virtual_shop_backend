const jwt = require('jsonwebtoken');
const config = require('config')
const allAuth = (req,res,next) => {
  const shopToken = req.header('shop_token');
  const customarToken = req.header('customar_token');
  if(!shopToken  || !customarToken) return res.status(401).send("you are not authenticated")
  try{
    const checkShopToken = jwt.verify(shopToken,config.get('jwtPrivatekey'));
    const checkCustomarToken = jwt.verify(customarToken,config.get('jwtPrivatekey'));
    next();
  }catch(e) {
    return res.status(400).send('invalid token');
  }
}

module.exports = allAuth;
