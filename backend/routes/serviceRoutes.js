const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { addService, getAllServices } = require('../controllers/serviceController');
const Service = require('../models/services'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

router.post('/add_service', upload.single('doctorImage'), addService);
router.get('/get_all', getAllServices);

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Service.destroy({ where: { id: id } });
        res.json({ success: true, message: "Doctor deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;