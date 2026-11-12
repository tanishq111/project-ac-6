import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const token = ({ user }) => {
    return jwt.sign({ id: user._id, email: user.email, username: user.username }, process.env.SECRET_KEY, { expiresIn: "15m" });
};

const createRefreshToken = ({ user }) => {
    return jwt.sign({ id: user._id, email: user.email, username: user.username }, process.env.REFRESH_SECRET_KEY, { expiresIn: "7d" });
};


const generateToken = ({ user }) => {
    return {
        token: token({ user }),
        refreshToken: createRefreshToken({ user })
    };
};

const register = async (req, res) => {  
    const { username, email, password } = req.body;
    const user = new User({ username, email, password});
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
};


const login = async (req, res) => { // after successfull login i need to return jwt from here
   const { email, password } = req.body;
   const user = await User.findOne({ email });
   if (!user) {
       return res.status(400).json({ message: "Invalid email or password" });
   }
   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) {
       return res.status(400).json({ message: "Invalid email or password" });
   }
   res.status(200).json({ message: "Login successful" , ...generateToken({ user }) });
};

const refreshToken = async (req, res) => {
    const submittedToken = req.body?.refreshToken;
    if (typeof submittedToken !== "string" || !submittedToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }

    let payload;
    try {
        payload = jwt.verify(submittedToken, process.env.REFRESH_SECRET_KEY, { algorithms: ["HS256"] });
    } catch {
        return res.status(401).json({ message: "Refresh token invalid or expired" });
    }

    const user = await User.findById(payload.id);
    if (!user) {
        return res.status(401).json({ message: "User no longer exists" });
    }
    res.status(200).json({ token: token({ user }) });
};

export { register, login, refreshToken };