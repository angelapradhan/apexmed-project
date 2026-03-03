const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const Favorite = require('../models/favouriteModel.js');
const Doctor = require('../models/services');
const Notification = require('../models/notification');
const Hospital = require('../models/hospital_model.js');
const path = require('path');
const fs = require('fs');

const addUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({ success: true, message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Token generate garne
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// forgor password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found with this email" });
        }

        // 6 digit otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiration time (1 hour from now)
        const expires = new Date(Date.now() + 3600000);

        user.otp = otp;
        user.otpexpires = expires;
        await user.save(); 

        
        console.log(` DEBUG: OTP for ${email} is: ${otp}`);
        
        // Nodemailer Configuration
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS  
            },
            tls: { rejectUnauthorized: false }
        });

        // Send Email
        await transporter.sendMail({
            from: `"ApexMed Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset OTP - ApexMed",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>Your verification code for ApexMed is:</p>
                    <h3 style="background-color: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px;">${otp}</h3>
                    <p>This code is valid for <strong>1 hour</strong>.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `
        });

        res.status(200).json({ success: true, message: "OTP sent to your email" });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
};

// verify otpp
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });

        console.log(` DEBUG: Verifying OTP for ${email}`);
        console.log(` DEBUG: Received OTP: ${otp} (Type: ${typeof otp})`);

        const user = await User.findOne({ where: { email, otp: otp.toString() } });

        if (!user) {
            console.log("❌ DEBUG: User not found with this email/otp combination");
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (new Date(user.otpexpires) < new Date()) {
            console.log("❌ DEBUG: OTP expired");
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        console.log("✅ DEBUG: OTP Verified Successfully");
        res.status(200).json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// reset
const resetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.otp = null;
        user.otpexpires = null;
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password', 'otp', 'otpexpires'] }
        });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await user.destroy();
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserCount = async (req, res) => {
    try {
        const count = await User.count({
            where: {
                role: 'user'
            }
        });

        res.status(200).json({
            success: true,
            count: count
        });
    } catch (error) {
        console.error("Error fetching user count:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching count"
        });
    }
};

//fav
const toggleFavorite = async (req, res) => {

    const { userId, doctorId, hospitalId, type } = req.body;

    try {
        let existingFav;

        if (type === 'hospital') {
            existingFav = await Favorite.findOne({ where: { userId, hospitalId } });
        } else {
            existingFav = await Favorite.findOne({ where: { userId, doctorId } });
        }

        if (existingFav) {
            await existingFav.destroy();
            return res.json({
                success: true,
                isFavorite: false,
                message: "Removed from favorites"
            });
        } else {
            const newFavData = { userId, type };
            if (type === 'hospital') {
                newFavData.hospitalId = hospitalId;
            } else {
                newFavData.doctorId = doctorId;
            }

            await Favorite.create(newFavData);

            try {
                await Notification.create({
                    userId: 'ADMIN',  
                    title: 'New Favourite Added',
                    message: `User ${req.body.userId} added a favorite.`,
                    type: 'favorite'
                });
            } catch (notifErr) {
                console.error("Notification creation failed:", notifErr);
            }

            return res.json({
                success: true,
                isFavorite: true,
                message: "Added to favorites"
            });
        }
    } catch (error) {
        console.error("Toggle Favorite Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyFavorites = async (req, res) => {
    try {
        const userId = req.user.id; 
        const favorites = await Favorite.findAll({
            where: { userId },
            include: [
                {
                    model: Doctor,
                    as: 'doctorDetails', 
                },
                {
                    model: Hospital,
                    as: 'hospitalDetails', 
                }
            ]
        });
        res.json({ success: true, favorites });
    } catch (error) {
        console.error("Get Favorites Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const checkFavoriteStatus = async (req, res) => {
    const { userId, doctorId, hospitalId, type } = req.body;
    try {
        let favorite;

        if (type === 'hospital') {
            favorite = await Favorite.findOne({ where: { userId, hospitalId } });
        } else {
            favorite = await Favorite.findOne({ where: { userId, doctorId } });
        }

        res.json({
            success: true,
            isFavorite: !!favorite
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// pp upload
const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const userId = req.user.id; 

        const imageUrl = `/uploads/profiles/${req.file.filename}`;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Delete old picture 
        if (user.profilePicture && user.profilePicture.startsWith('/uploads/profiles/')) {
            const oldPath = path.join(__dirname, '..', user.profilePicture);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        await user.update({ profilePicture: imageUrl });

        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name } = req.body; 
        const userId = req.user.id;

        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await user.update({ username: name });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// chnage ps
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id; 

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Please provide both current and new passwords" });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }


        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect current password" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully. Please log in again."
        });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {
    addUser,
    loginUser,
    forgotPassword,
    verifyOTP,
    resetPassword,
    getAllUsers,
    deleteUser,
    getUserCount,
    toggleFavorite,
    getMyFavorites,
    checkFavoriteStatus,
    uploadProfilePicture, 
    updateProfile,
    changePassword

};