import bcrypt from "bcrypt";
import asyncHandler from "../middlewares/asyncHandler.js";
import httpStatus from "http-status";
import {User} from "../models/userModel.js";
import createToken from "../utils/createToken.js";
import { Meeting } from "../models/meetingModel.js";
import config from "../config/config.js";


const createUser  = asyncHandler( async (req, res) => {
    const {email, username, password} = req.body;

    if(!email || !password || !username){
        throw new Error("Please fill all the inputs");
    }

    const alreadyExists = await User.findOne({email});

    if(alreadyExists){
        return res.status(httpStatus.FOUND).json({message:"User already exists"});
    }

    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);
    console.log(username, email, hash);

    try {
        const newUser = await User.create({username, email, password: hash});

        const token = await createToken(res, newUser._id);
        newUser.token = token;

        await newUser.save();

        res.status(httpStatus.CREATED).json({message: "User created"});
        
    } catch (error) {
        res.status(500).json({message: error});
    }

})

const loginUser = asyncHandler( async (req, res) =>{
    const {username, password} = req.body;

    if(!username && !password){
        return res.status(400).json({message: "Please enter the username & password"});
    }

    try {
        const user = await User.findOne({username: username});

        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message: "Enter a valid username"});
        }

        if(await bcrypt.compare(password, user.password)){
            const token = await createToken(res, user._id);
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({token: token})
        }
        else{
            return res.status(httpStatus.UNAUTHORIZED).json({message: "Invalid Password"});
        }
        
        
    } catch (error) {
        res.status(500).json({message: `Something went wrong ${error}`});
    }
})

const getUserHistory = async (req, res) => {
    const token = req.cookies.jwt ;

    try {
        const user = await User.findOne({ token: token });
        const meetings = await Meeting.find({ user_id: user.username })
        console.log(meetings, { user_id: user.username });
        res.json(meetings)
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

const addToHistory = async (req, res) => {
    const { meeting_code } = req.body;
    const token = req.cookies.jwt;

    try {
        const user = await User.findOne({ token: token });

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Added code to history" })
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: config.IS_PRODUCTION,
    sameSite: config.IS_PRODUCTION?"none":"lax",    
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export { createUser, loginUser, getUserHistory, addToHistory, logoutUser }