import express from 'express';
import { authRoute, postRoute, profileRoute, userRoute } from './controllers/index.js';
const mainRouter = express.Router();

mainRouter.use('/auth', authRoute);
mainRouter.use('/posts', postRoute);
mainRouter.use('/profile', profileRoute);
mainRouter.use('/user', userRoute);

export default mainRouter;