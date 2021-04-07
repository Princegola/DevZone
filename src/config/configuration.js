// import dotenv from 'dotenv';

// const envVars = dotenv.config();
import dotenv from 'dotenv';
const envVars = dotenv.config();


const configuration = {
    port: envVars.parsed.PORT,
    nodeEnv: envVars.parsed.NODE_ENV,
    mongoURI: envVars.parsed.MONGO_URI,
    githubClientId: envVars.parsed.GITHUB_CLIENT_ID,
    githubSecret: envVars.parsed.GITHUB_SECRET,
    secretKey: envVars.parsed.SECRET_KEY,
};
// console.log(configuration);

// Object.freeze(configuration);
export default configuration;