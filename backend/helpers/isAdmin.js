const isAdmin = (req, res, next) => {
    // req.user.role check garnuhos, yo 'admin' huna parcha
    if (req.user && req.user.role === 'admin') { 
        next(); // Role match bhaye agadi badne
    } else {
        res.status(403).json({ success: false, message: "Access Denied: Admin only!" });
    }
};

module.exports = isAdmin;