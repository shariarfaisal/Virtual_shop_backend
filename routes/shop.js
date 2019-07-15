const router = require('express').Router();
const shop = require('../controllers/shop');

router.post('/register',shop.register);
router.get('/',shop.getAllShops);
router.get('/:id',shop.getSingleShop);
router.delete('/:id',shop.deleteShop);
router.put('/:id',shop.editShop);

module.exports = router;
