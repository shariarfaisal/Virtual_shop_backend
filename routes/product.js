const router = require('express').Router();
const Product = require('../controllers/product');
const shopAuth = require('../middleware/shopAuth')
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req,file,cb) {
    cb(null,'uploads/')
  },
  filename: function(req,file,cb){
    cb(null,Date.now() + '-' + file.originalname);
  }
})

const fileFilter = (req,file,cb) => {
  if(file.mimetype === 'image/jpeg'|| file.mimetype === 'image/png'|| file.mimetype === 'image/jpg' ){
    cb(null,true);
  }else{
    cb(null,false);
  }
}

const upload = multer({storage: storage,limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
})
router.post('/',shopAuth,upload.single('image'),Product.getPostProduct);
router.get('/',Product.getAllProduct);
router.get('/shop',shopAuth,Product.getProductsWithShopId);
router.get('/:categoryId/category',Product.getProductsWithCategoryId);
router.get('/:id',Product.getSingleProduct);
router.put('/:id',shopAuth,Product.getUpdateProduct);
router.delete('/:id',shopAuth,Product.getDeleteProduct);

module.exports = router;
