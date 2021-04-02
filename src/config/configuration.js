// import dotenv from 'dotenv';

// const envVars = dotenv.config();
import dotenv from 'dotenv';
dotenv.config();
const envVars = process.env;


const configuration = {
    port: envVars.PORT,
    nodeEnv: envVars.NODE_ENV,
    mongoURI: envVars.MONGO_URI,
};

Object.freeze(configuration);
export default configuration;