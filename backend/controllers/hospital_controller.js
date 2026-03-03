const Hospital = require('../models/hospital_model');

const createHospital = async (req, res) => {
    try {
        if (!req.files || !req.files['hospitalLogo'] || !req.files['coverImage']) {
            return res.status(400).json({ success: false, message: "Logo and Cover Image are required!" });
        }

        const { 
            hospitalName, hospitalType, establishedYear, address, city, 
            province, phone, emergencyPhone, email, website, 
            departments, feeRange, emergency247, icuAvailable 
        } = req.body;

        const hospitalLogo = req.files['hospitalLogo'][0].filename;
        const coverImage = req.files['coverImage'][0].filename;

        // required fields validation
        if (!hospitalName || !hospitalType || !province || !city) {
            return res.status(400).json({ success: false, message: "Please fill required fields" });
        }

        const newHospital = await Hospital.create({
            hospitalName, 
            hospitalType, 
            establishedYear, 
            address, 
            city,
            province, 
            phone, 
            emergencyPhone, 
            email, 
            website,
            departments, 
            feeRange, 
            emergency247, 
            icuAvailable,
            hospitalLogo,
            coverImage   
        });

        res.status(201).json({ success: true, message: "Hospital added to Postgres!", hospital: newHospital });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
};

const getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.findAll();
        res.status(200).json({ success: true, hospitals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getSingleHospital = async (req, res) => {
    try {
        const { id } = req.params;
        const hospital = await Hospital.findByPk(id);
        if (!hospital) {
            return res.status(404).json({ success: false, message: "Hospital not found" });
        }
        res.status(200).json({ success: true, hospital });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteHospital = async (req, res) => {
    try {
        const { id } = req.params;

        const hospital = await Hospital.findByPk(id);
        if (!hospital) {
            return res.status(404).json({ success: false, message: "Hospital not found" });
        }

        // delete garne
        await Hospital.destroy({
            where: { id: id }
        });

        res.status(200).json({ success: true, message: "Hospital deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
};

module.exports = { createHospital, getAllHospitals, getSingleHospital, deleteHospital};