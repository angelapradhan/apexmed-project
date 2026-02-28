const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const Favorite = require('../models/favouriteModel.js');
const Doctor = require('../models/services');

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
            { id: user.id, role: user.role },  //role admin ko lagi add gareko
            process.env.JWT_SECRET || "default_secret", // Fallback if .env fails
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user.id, username: user.username, email: user.email,
                role: user.role
            } // yeta ne admin ko lagi role
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 1. FORGOT PASSWORD - Send OTP
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found with this email" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // DBeaver ko column name anusar 'otpexpires' (all small) use gareko
        user.otp = otp;
        user.otpexpires = new Date(Date.now() + 3600000);
        await user.save();

        console.log("-----------------------------------------");
        console.log(`🚀 DEBUG: OTP for ${email} is: ${otp}`);
        console.log("-----------------------------------------");

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

        await transporter.sendMail({
            from: `"ApexMed Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset OTP - ApexMed",
            html: `<h3>Your OTP is: <b>${otp}</b></h3><p>Valid for 1 hour.</p>`
        });

        res.status(200).json({ success: true, message: "OTP sent to your email" });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/// 2. VERIFY OTP - Yo thau ma mismatch thiyo, aba fix bhayo
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });

        const user = await User.findOne({ where: { email, otp: otp.toString() } });

        if (!user || new Date(user.otpexpires) < new Date()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        res.status(200).json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. RESET PASSWORD
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


// --- ADMIN: Sabai users ko list nikalne ---
const getAllUsers = async (req, res) => {
    try {
        // Password pathaunu hudaina, tesaile exclude gareko
        const users = await User.findAll({
            attributes: { exclude: ['password', 'otp', 'otpexpires'] }
        });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};

// --- ADMIN: User delete garne ---
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

// --- ADMIN: Total users ko sankhya nikalne ---
// --- ADMIN: Kebal 'user' role bhayekaharu ko matra count nikalne ---
const getUserCount = async (req, res) => {
    try {
        // Sequelize ma 'where' condition halera filter garne
        const count = await User.count({
            where: {
                role: 'user' // Kebal user haru matra count hunchha, admin count hudaina
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
    const { userId, doctorId } = req.body;
    try {
        const existingFav = await Favorite.findOne({ where: { userId, doctorId } });

        if (existingFav) {
            await existingFav.destroy();
            return res.json({ 
                success: true, 
                isFavorite: false, 
                message: "Removed from favourites" 
            });
        } else {
            await Favorite.create({ userId, doctorId });
            return res.json({ 
                success: true, 
                isFavorite: true, 
                message: "Added to favourites" // <-- Yo message front-end ma alert ma aauchha
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyFavorites = async (req, res) => {
    try {
        const userId = req.user.id; // authGuard le pathako ID
        const favorites = await Favorite.findAll({
            where: { userId },
            include: [{
                model: Doctor,
                as: 'doctorDetails' // Mathi model ma define gareko name
            }]
        });
        res.json({ success: true, favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const checkFavoriteStatus = async (req, res) => {
    const { userId, doctorId } = req.body;
    try {
        const favorite = await Favorite.findOne({ where: { userId, doctorId } });
        res.json({
            success: true,
            isFavorite: !!favorite // Yedi bhetiyo bhane true, natra false
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Export ma loginUser thapa
module.exports = {
    addUser,
    loginUser,
    forgotPassword,
    verifyOTP,
    resetPassword,
    getAllUsers, // <--- Add this
    deleteUser,
    getUserCount,
    toggleFavorite,
    getMyFavorites,
    checkFavoriteStatus
};