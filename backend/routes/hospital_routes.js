const router = require('express').Router();
const hospitalController = require('../controllers/hospital_controller');
const upload = require('../middleware/upload_middleware'); 

router.post('/add', upload.fields([
    { name: 'hospitalLogo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), hospitalController.createHospital);

router.get('/all', hospitalController.getAllHospitals);
router.get('/single/:id', hospitalController.getSingleHospital);
router.delete('/delete/:id', hospitalController.deleteHospital);

module.exports = router;