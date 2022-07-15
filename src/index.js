import express from 'express';
import { PORT, MONGO_URL } from './config.js';
import mongoose from 'mongoose';
import { logger } from './middleware/logger.js';
import { error } from './middleware/error.js';
import { router as advertisementRouter } from './routes/advertisementRouter.js';
import { router as authRouter } from './routes/authRouter.js';

const app = express();

async function start(PORT, MONGO_URL) {
    try {
        await mongoose.connect(MONGO_URL);
        app.listen(PORT);
    } catch (e) {
        console.log(e);
    }
}

app.use(express.json());

app.use(logger);

app.use('/api/signin', authRouter);
app.use('/api/signup', authRouter);
app.use('/app/advertisements', advertisementRouter);

app.use(error);

start(PORT, MONGO_URL);
