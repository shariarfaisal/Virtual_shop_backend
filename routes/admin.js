const router = require('express').Router();
const Admin = require('../controllers/admin');
const adminAuth = require('../middleware/adminAuth');


router.post('/register',Admin.register);
router.post('/login',Admin.login);
router.get('/',Admin.getAllAdmin);
// router.get('/:adminId',Admin.getSingleAdmin);
router.get('/me',adminAuth,Admin.getMe);
router.put('/',adminAuth,Admin.getUpdateAdmin);
router.delete('/:adminId',Admin.deleteAdmin);

module.exports = router;
