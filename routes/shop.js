const router = require('express').Router();
const shop = require('../controllers/shop');
const shopAuth = require('../middleware/shopAuth');
const multer = require('multer');
const customarAuth = require('../middleware/customarAuth');

const storage = multer.diskStorage({
  destination: function (req,file,cb) {
    cb(null,'uploads/')
  },
  filename: function(req,file,cb) {
    cb(null,'shop-'+Date.now()+file.originalname);
  }
})

const fileFilter = (req,file,cb) => {
  if(file.mimetype === 'image/jpeg'|| file.mimetype === 'image/png'|| file.mimetype === 'image/jpg'){
    cb(null,true);
  }else{
    cb(null,false)
  }
}

const upload = multer({storage: storage,limits: {fileSize: 1024 * 1024 * 10},fileFilter: fileFilter})


router.post('/register',shop.register);
router.post('/login',shop.login);
router.get('/',shop.getAllShops);
router.get('/me',shopAuth,shop.getSingleShop);
router.get('/:id',customarAuth,shop.getShopById);
router.delete('/',shopAuth,shop.deleteShop);
router.put('/',shopAuth,shop.editShop);
router.put('/password',shopAuth,shop.changePassword);
router.post('/image',upload.single('image'),shopAuth,shop.imageUpload);
router.post('/about',shopAuth,shop.addAbout);

module.exports = router;
