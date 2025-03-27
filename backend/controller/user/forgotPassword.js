const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

// const forgotPasswordController = async (req, res) => {
//     const startTime = Date.now();
//     const { email } = req.body;

//     try {

//         //     const startTime = Date.now(); // Track time
//         // await user.save();
//         // console.log("Reset token generated in:", Date.now() - startTime, "ms");


//         console.log(`[${new Date().toISOString()}] Request received for: ${email}`);
        
        
//         const user = await User.findOne({ email });
//         if (!user) return res.status(404).json({ message: "User not found" });
//         console.log(user);
//         console.log("User found - Time:", Date.now() - startTime, "ms");
//         // Generate reset token
//         const resetToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "1h" });


//         // Save reset token in DB
//         user.resetToken = resetToken;
//         user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
//         await user.save();

//         console.log("Reset token saved - Time:", Date.now() - startTime, "ms");


//         console.log("Starting email sending...");
//         // Email configuration
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.MAIL_USER,
//                 pass: process.env.MAIL_PASS
//             }
//         });



//         // Send email
//         const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//         setImmediate(async () => {
//             try {
//                 await transporter.sendMail({
//                     from: process.env.MAIL_USER,
//                     to: user.email,
//                     subject: "Password Reset Request",
//                     text: `Click the link below to reset your password:\n\n${resetLink}\n\nThis link expires in 1 hour.`
//                 });
//                 console.log("Email sent - Time:", Date.now() - startTime, "ms");

//             } catch (error) {
//                 console.error("Error sending email:", error.message);
//             }
//         })

//         res.status(200).json({ message: "Password reset link sent to your email." });
//         console.log("Response sent - Time:", Date.now() - startTime, "ms");
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// module.exports = forgotPasswordController;


//2nd method


// const forgotPasswordController = async (req, res) => {
//     const startTime = Date.now(); // Start tracking time
//     const { email } = req.body;

//     try {
//         console.log(`[${new Date().toISOString()}] Request received for: ${email}`);

//         const user = await User.findOne({ email }).lean(); // Optimized query
//         if (!user) return res.status(404).json({ message: "User not found" });

//         console.log("User found - Time:", Date.now() - startTime, "ms");

//         // Generate reset token
//         const resetToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "1h" });

//         // Save reset token in DB
//         await User.updateOne({ _id: user._id }, { resetToken, resetTokenExpiry: Date.now() + 3600000 });
//         console.log("Reset token saved - Time:", Date.now() - startTime, "ms");

//         const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//         // Send email asynchronously using setImmediate
//         setImmediate(async () => {
//             try {
//                 console.log("Starting email sending...");
                
//                 const transporter = nodemailer.createTransport({
//                     host: process.env.MAIL_HOST || "smtp.gmail.com",
//                     secure: false,
//                     auth: {
//                         user: process.env.MAIL_USER,
//                         pass: process.env.MAIL_PASS
//                     }
//                 });

//                 await transporter.sendMail({
//                     from: process.env.MAIL_USER,
//                     to: user.email,
//                     subject: "Password Reset Request",
//                     text: `Click the link below to reset your password:\n\n${resetLink}\n\nThis link expires in 1 hour.`
//                 });
//                 console.log("Email sent - Time:", Date.now() - startTime, "ms");

//             } catch (error) {
//                 console.error("Error sending email:", error.message);
//             }
//         });

//         res.status(200).json({ message: "Password reset link will be sent shortly to your email." });
//         console.log("Response sent - Time:", Date.now() - startTime, "ms");

//     } catch (error) {
//         console.error("Server error:", error.message);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// module.exports = forgotPasswordController;



const forgotPasswordController = async (req, res) => {
    const startTime = Date.now(); // Start tracking time
    const { email } = req.body;

    try {
        console.log(`[${new Date().toISOString()}] Request received for: ${email}`);

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email }).lean(); // Optimized query
        if (!user) return res.status(404).json({ message: "User not found" });

        console.log("User found - Time:", Date.now() - startTime, "ms");

        // Generate reset token
        const resetToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "1h" });

        // Save reset token in DB
        const updateResult = await User.updateOne(
            { _id: user._id },
            { resetToken, resetTokenExpiry: Date.now() + 3600000 }
        );
        
        if (updateResult.modifiedCount === 0) {
            throw new Error("Failed to update user token");
        }
        
        console.log("Reset token saved - Time:", Date.now() - startTime, "ms");

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send email asynchronously using setImmediate
        setImmediate(async () => {
            try {
                console.log("Starting email sending...");
                
                const transporter = nodemailer.createTransport({
                    host: process.env.MAIL_HOST || "smtp.gmail.com",
                    port: parseInt(process.env.MAIL_PORT, 10) || 587,
                    secure: false,
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS
                    }
                });

                await transporter.sendMail({
                    from: process.env.MAIL_USER,
                    to: user.email,
                    subject: "Password Reset Request",
                   text: `Click the link below to reset your password:\n\n${resetLink}\n\nThis link expires in 1 hour.\n\nTime of Request: ${emailTime}`
                });
                console.log("Email sent - Time:", Date.now() - startTime, "ms");

            } catch (error) {
                console.error("Error sending email:", error.message);
            }
        });

        res.status(200).json({ message: "Password reset link will be sent shortly to your email." });
        console.log("Response sent - Time:", Date.now() - startTime, "ms");

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = forgotPasswordController;
