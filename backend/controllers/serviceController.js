const Service = require("../models/services");

const addService = async (req, res) => {
    try {
        console.log("Form Data Received:", req.body);
        console.log("File Received:", req.file);

        const { 
            doctorName, 
            specialization, 
            price, 
            availableTime,
            rating,
            patients,
            gender,
            qualification,
            experience,
            medicalLicense,
            contact,
            email,
            bio
        } = req.body;

        const doctorImage = req.file ? req.file.filename : null; 

        // validation 
        if (!doctorName || !doctorImage || !specialization || !price) {
            return res.status(400).json({ 
                success: false, 
                message: "Required fields (Name, Specialization, Price, Image) are missing!" 
            });
        }

        const newService = await Service.create({
            doctorName,
            specialization,
            price: Number(price),
            availableTime: availableTime || "9:00 AM - 5:00 PM",
            doctorImage,
            rating: rating || "4.8",
            patients: patients || "1500+",
            gender: gender || "Male",
            qualification,
            experience,
            medicalLicense,
            contact,
            email,
            bio
        });

        res.status(201).json({ 
            success: true, 
            message: "Doctor Profile Registered Successfully!", 
            service: newService 
        });


        res.status(201).json({ 
            success: true, 
            message: "Doctor Profile Registered Successfully!", 
            service: newService 
        });

    } catch (error) {
        console.error("Add Service Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Database Error: " + error.message 
        });
    }
};

const getAllServices = async (req, res) => {
    try {
        // Sabai data tanne
        const services = await Service.findAll({ order: [['id', 'DESC']] });
        res.status(200).json({ success: true, services });
    } catch (error) {
        console.error("Get Services Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { addService, getAllServices };