
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import { ENV } from "../lib/env.js"

import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;


        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All field are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 digit" });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid Email format" });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "user already exist" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });


        if (newUser) {
            // before CR:
            // generateToken(newUser._id, res);
            // await newUser.save();

            // after CR:
            // Persist user first, then issue auth cookie
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL)
            } catch (error) {
                console.error("Failed to send Welcome email : ", error);
            }

        } else {
            res.send(400).json({ message: "Invalid user details" });
        }
    } catch (error) {
        console.log("Error in SignUp Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }


}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials" });

        //user is valid
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("Error in Login Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = (_, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out Successfully" });
}