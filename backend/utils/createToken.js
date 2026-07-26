import jwt from "jsonwebtoken";
import config from "../config/config.js";

const createToken = async (res, userId) => {
    const token = await jwt.sign({userId}, config.JWT_SECRET,{expiresIn: "7d"});

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: config.IS_PRODUCTION,
        sameSite: config.IS_PRODUCTION?"none":"lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return token;
}

export default createToken;