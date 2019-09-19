const router = require('express').Router();
const Customar = require('../controllers/customar');
const customarAuth = require('../middleware/customarAuth');
const adminAuth = require('../middleware/adminAuth')

router.post('/register',Customar.register);
router.post('/login',Customar.login);
router.get('/',Customar.getAllCustomar);
router.get('/me',customarAuth,Customar.getMyAccount);
router.get('/:id',Customar.getSingleCustomar);
router.delete('/:id',Customar.getDeleteCustomar);
router.put('/',customarAuth,Customar.getUpdateCustomar);
router.post('/favourite',customarAuth,Customar.favourite);
router.post('/follow',customarAuth,Customar.follow);

module.exports = router;
