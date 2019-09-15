const router = require('express').Router();
const category = require('../controllers/category');
const allAuth = require('../middleware/allAuth');
// const customarAuth = require('../middleware/customarAuth');
const shopAuth = require('../middleware/shopAuth');


router.post('/',category.postCategory);
router.get('/',category.getAllCategory);
router.get('/:id',category.getSingleCategory);
router.put('/:id',category.getUpdateCategory);
router.delete('/:id',category.deleteCategory);

module.exports = router;
