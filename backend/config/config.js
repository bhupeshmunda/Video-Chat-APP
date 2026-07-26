import dotenv from "dotenv"

dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error("Mongo url is not defined in environmental variable");
}

const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET : process.env.JWT_SECRET,
    IS_PRODUCTION : process.env.IS_PRODUCTION,
    FRONTEND_URL : process.env.FRONTEND_URL,
}

export default config;