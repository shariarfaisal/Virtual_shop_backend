const router = require('express').Router();
const shop = require('../controllers/shop');
const shopAuth = require('../middleware/shopAuth');


router.post('/register',shop.register);
router.post('/login',shop.login);
router.get('/',shop.getAllShops);
router.get('/me',shopAuth,shop.getSingleShop);
router.delete('/',shopAuth,shop.deleteShop);
router.put('/',shopAuth,shop.editShop);

module.exports = router;
