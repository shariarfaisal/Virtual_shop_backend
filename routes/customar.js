const router = require('express').Router();
const Customar = require('../controllers/customar');
const customarAuth = require('../middleware/customarAuth');
router.post('/register',Customar.register);
router.post('/login',Customar.login);
router.get('/',Customar.getAllCustomar);
router.get('/me',customarAuth,Customar.getMyAccount);
router.get('/:id',Customar.getSingleCustomar);
router.delete('/:id',customarAuth,Customar.getDeleteCustomar);
router.put('/',customarAuth,Customar.getUpdateCustomar);

module.exports = router;
